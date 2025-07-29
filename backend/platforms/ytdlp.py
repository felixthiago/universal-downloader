import requests
import mimetypes

from yt_dlp import YoutubeDL
from yt_dlp.utils import DownloadError

MAX_FILE_SIZE = 1000


def stream_media(url):
    try:
        with YoutubeDL({"quiet": True, "cookiefile": "../cookies.txt"}) as ydl:
            info = ydl.extract_info(url, download = False)

            video_id = info.get("id")
            ext = info.get("ext")
            filename = f"{video_id}.{ext}"
            mime_type = mimetypes.types_map.get(f".{ext}", "application/octet-stream")

            params = {
                "format": "best",
                "outtmpl": filename,
                "merge_output_format": "mp4"
            }

            with YoutubeDL(params) as ydl:
                info = ydl.extract_info(url, download = False)

                size = info.get("filesize_approx")
                mbs = size / (1024 * 1024)
                print(mbs)
                if mbs > MAX_FILE_SIZE:
                    raise DownloadError(f"Fie size exceeds the limit of {MAX_FILE_SIZE}MB")
                if "entries" in info:
                    raise DownloadError("This URL contains multiple entries, please specify a single entry.")
                else:
                    hls = info['url']

                res = requests.get(hls, stream=True)
                if res.status_code == 200:
                    response = dict(
                        res = res.raw,
                        filename = filename,
                        mime_type = mime_type,
                        video_id = video_id,
                        title = info.get("title").encode("ascii","" "ignore").decode("ascii") or "Unknown Title"
                    )
                    return response
                else:
                    print(f"Failed to download! {res.status_code} \n {res.text}")

    except DownloadError as e:
        print(f"Error while downloading: {e}")
