from platforms.ytdlp import stream_media
from core.aws import upload_media

res = stream_media("https://x.com/beingblackie_/status/1949023124877705524")

url = upload_media(res)
print(url)
print(f"Url achada e deletando arquivo em 60 segundos")