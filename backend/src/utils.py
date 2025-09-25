import os
import shutil
import uuid
from fastapi import HTTPException


def save_file(file, id=None):
    allowed_extensions = {
        "mp4",
        "mov",
        "avi",
        "jpg",
        "jpeg",
        "png",
        "gif",
        "doc",
        "docx",
        "pdf",
    }
    file_extension = file.filename.split(".")[-1] if file.filename else ""
    if file_extension not in allowed_extensions:
        raise HTTPException(status_code=400, detail="File type not supported.")

    if not os.path.exists("media"):
        os.mkdir("media")

    item_id = id or uuid.uuid4()
    file_path = f"media/{item_id}.{file_extension}"
    with open(file_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    return file_path
