import boto3
import logging
import threading

BUCKET = "westernunion6000"

s3_client = boto3.client("s3")
s3_resource = boto3.resource("s3")

def upload_media(res):
    raw = res.get("res")
    filename = res.get("filename")
    mime_type = res.get("mime_type") or "video/mp4"
    metadata = {
        "id": res.get("video_id", ""),
        "title": res.get("title", "")
    }

    try:
        s3_client.upload_fileobj(
            Fileobj = raw,
            Bucket = BUCKET,
            Key = filename,
            ExtraArgs={
                'ContentType': mime_type,
                'Metadata': metadata,
                'ServerSideEncryption': 'AES256'
        })
        
    except Exception as err:
        logging.error(f"upload failed for key = {filename}: {err}")
        raise Exception(f"upload failed: {err}")
    
    presigned = generate_presigned_url(filename)
    return {
        "key": filename,
        "url": presigned,
        "content_type": mime_type
            }

def generate_presigned_url(key, expires_in = 60 * 30):
    try:
        threading.Timer(60, delete_media, args = (key, )).start()

        return s3_client.generate_presigned_url(
            ClientMethod = "get_object",
            Params = {
                "Bucket": BUCKET,
                "ResponseContentDisposition": f'attachment; filename="{key}"',
                "Key": key
            },
            ExpiresIn = expires_in
        )    
        
    except Exception as e:
        logging.error(f"Error while generating presigned URL ->> {e}")
        return None

def delete_media(key):
    try:
        s3_client.delete_object(Bucket = BUCKET,  Key = key)
    except Exception as e:
        logging.error(f"Error while deleting media: {e}")
