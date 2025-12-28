from colorama import init
init()

import sys, os
sys.path.append(os.path.dirname(__file__))

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from platforms.ytdlp import stream_media, YoutubeAuthRequired
from core.aws import upload_media
from macawdemy.essays import get_essay
# from fastapi.responses import StreamingResponse
# from yt_dlp import YoutubeDL

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials = True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def index():
    return {"Hello": "World",
            "api": "health yes "}

@app.exception_handler(YoutubeAuthRequired)
async def youtube_auth_handler(request, exc: YoutubeAuthRequired):
    return JSONResponse(
        status_code = 403,
        detail = str(exc)
)

@app.post("/upload/")
def upload_video(video_url: str = Query(..., description="URL do vídeo")):
    res = stream_media(video_url)

    if res is None:
        return HTTPException(status_code = 404, detail = "Erro ao baixar o vídeo, tente novamente com outro link!")
    
    # 50% pronto
    info = upload_media(res)

    if not info:
        raise HTTPException(status_code = 500, detail = "Erro ao fazer upload do vídeo!!")

    return {
        "download_url": info["url"],
        "filename": info["key"],
        "content-type": info["content_type"]
        }

from pydantic import BaseModel
class RedacaoRequest(BaseModel):
    redacao_text: str

@app.post("/redacao/")
def corrigir_redacao(payload: RedacaoRequest):
    try:
        resultado = get_essay(payload.redacao_text)
        return JSONResponse(content = resultado)
    except Exception as e:
        if "TextModelError" in str(e):
            raise HTTPException(status_code = 400, detail = "O texto fornecido não é um texto dissertativo-argumentativo.")
        raise HTTPException(status_code = 500, detail = str(e))