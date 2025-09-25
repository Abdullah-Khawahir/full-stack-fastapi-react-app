import os
import shutil
from src.dtos.item_dto import ItemResponseDTO
from src.database import get_db
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from fastapi.responses import FileResponse
from uuid import UUID

from src.schema.item_model import Item
from sqlalchemy.orm import Session

router = APIRouter(prefix="/media", tags=["files"])


@router.get("/{item_id}", response_class=FileResponse)
def get_item_media(item_id: UUID, db: Session = Depends(get_db)):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return FileResponse(item.file_uri)


@router.put("/{item_id}", response_model=ItemResponseDTO)
def update_item_media(
    item_id: UUID, file: UploadFile = File(...), db: Session = Depends(get_db)
):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    if not os.path.exists("media"):
        os.mkdir("media")

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
    if item.file_uri and os.path.exists(item.file_uri):
        os.remove(item.file_uri)

    file_path = (
        f"media/{item_id}.{file_extension}" if file_extension else f"media/{item_id}"
    )

    with open(file_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    item.file_uri = file_path
    item.file_mime_type = file.content_type or ""
    db.commit()
    db.refresh(item)
    return item
