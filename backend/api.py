from fastapi import FastAPI, HTTPException, Query
from platforms.ytdlp import stream_media
from core.aws import upload_media

app = FastAPI()

@app.get("/")
def index():
    return {"Hello": "World",
            "api": "health working"}

@app.post("/api/upload/")
def upload_video(video_url: str = Query(..., description="URL do vídeo")):
    res = stream_media(video_url)
    info = upload_media(res)
    if not info:
        return HTTPException(status_code = 500, detail = "Erro ao fazer upload do vídeo!!")
    
    return {
        "download_url": info["url"],
        "filename": info["key"],
        "content-type": info["content_type"]
        }
