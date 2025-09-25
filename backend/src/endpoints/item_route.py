import os
from uuid import UUID
import uuid
from src.database import get_db
from src.utils import save_file
from fastapi import APIRouter, File, Form, UploadFile
from fastapi.param_functions import Depends
from src.schema.item_model import Item
from sqlalchemy.orm import Session
from fastapi import UploadFile, File
import shutil
from typing import List, Optional
from fastapi import HTTPException

from src.dtos.item_dto import ItemCreateDTO, ItemResponseDTO, ItemUpdateDTO

router = APIRouter(prefix="/items", tags=["Items"])


@router.get("/", response_model=List[ItemResponseDTO])
def get_all(db: Session = Depends(get_db)):
    return db.query(Item).all()


@router.get("/{item_id}", response_model=ItemResponseDTO)
def get_by_id(item_id: UUID, db: Session = Depends(get_db)):
    return db.query(Item).filter(Item.id == item_id).first()


@router.post("/", response_model=ItemResponseDTO)
def create(
    item_create: ItemCreateDTO = Depends(ItemCreateDTO.as_form),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
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

    item_id = uuid.uuid4()
    file_path = f"media/{item_id}.{file_extension}"
    with open(file_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    item = Item(
        id=item_id,
        title=item_create.title,
        description=item_create.description,
        price=item_create.price,
        quantity=item_create.quantity,
        file_mime_type=file.content_type,
        file_uri=file_path,
        order=item_create.order if item_create.order else -1,
    )

    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put("/{item_id}", response_model=ItemResponseDTO)
def update_item_by_id(
    item_id: UUID,
    item_update: ItemUpdateDTO,
    db: Session = Depends(get_db),
):

    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    update_data = item_update.dict(exclude_unset=True)

    for key, value in update_data.items():
        setattr(item, key, value)

    db.commit()
    db.refresh(item)
    return item


@router.delete("/{item_id}", status_code=204)
def delete_by_id(item_id: UUID, db: Session = Depends(get_db)):

    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(item)
    db.commit()
    return None
