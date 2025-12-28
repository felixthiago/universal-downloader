import requests
import mimetypes
import queue
import threading

from yt_dlp import YoutubeDL
from yt_dlp.utils import DownloadError

from fastapi.responses import StreamingResponse
#### error handlers

class YoutubeAuthRequired(Exception):
    def __init__(self, message: str):
        self.message = message
    
    def __str__(self):
        return f"YoutubeAuthRequired: {self.message}"
    
MAX_FILE_SIZE = 1000

def stream_media(url):
    try:
        with YoutubeDL({"quiet": True}) as ydl:
            info = ydl.extract_info(url, download = False)

            video_id = info.get("id")
            ext = info.get("ext")
            filename = f"{video_id}.{ext}"
            mime_type = mimetypes.types_map.get(f".{ext}", "application/octet-stream")

            params = {
                "format": "bv*+ba/b",
                "outtmpl": filename,
                "merge_output_format": "mp4",
                "verbose": True,
                "noplaylist": True,
                'nocheckcertificate': True,
                "extractor_args": {
                    "youtube": {
                        "formats": "missing_port"
                    }
                }
            }
            try:
                with YoutubeDL(params) as ydl:
                    info = ydl.extract_info(url, download = False)
                    if 'instagram' in info:
                        print('instagram na info')

                    # print(info)
                    thumbnail = info.get("thumbnail")
                    
                    formats = [
                        f for f in info.get("formats", [])
                        if f.get("vcodec") != "none" and f.get("acodec") != "none"
                    ]
                    best_format = max(formats, key = lambda f: (f.get("height", 0), f.get("tbr", 0)))

                    print(best_format)

                    hls = best_format.get("url")
                    if not hls:
                        raise Exception('no valid stream url has been found')

                    size = best_format.get("filesize_approx") or 0
                    if size:
                        mbs = size / (1024 * 1024)
                        if mbs > MAX_FILE_SIZE:
                            raise DownloadError(f"Fie size exceeds the limit of {MAX_FILE_SIZE}MB")
                        
                    if "entries" in info:
                        raise DownloadError("This URL contains multiple entries, please specify a single entry.")
                    else:
                        hls = best_format.get('url') or 0

                    res = requests.get(hls, stream=True)

                    if res.status_code == 200:
                        response = dict(
                            res = res.raw,
                            filename = filename,
                            mime_type = mime_type,
                            video_id = video_id,
                            thumbnail = thumbnail,
                            title = info.get("title").encode("ascii","" "ignore").decode("ascii") or "Unknown Title"
                        )
                        print(response)
                        return response
                    else:
                        print(f"Failed to download! {res.status_code} \n {res.text}")

            except Exception as e:
                error_msg = str(e)
                if "Sign in" in error_msg:
                    raise YoutubeAuthRequired("Authentication is required to download this video.")


    except DownloadError as e:
        error_msg = str(e)
        raise ValueError(f'Download Error > {error_msg}')