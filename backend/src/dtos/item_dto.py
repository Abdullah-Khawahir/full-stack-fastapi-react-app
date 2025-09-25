from fastapi import Form
from pydantic import BaseModel
from uuid import UUID
from typing import Optional

from pydantic import Field
from sqlalchemy import DateTime, Float, Integer


class ItemResponseDTO(BaseModel):
    id: UUID
    title: str
    description: str
    file_uri: str
    file_mime_type: str
    quantity: int
    price: float
    order: int

    class Config:
        orm_mode = True


class ItemUpdateDTO(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    quantity: Optional[int] = None
    price: Optional[float] = None
    order: Optional[int] = None


class ItemCreateDTO(BaseModel):
    title: str
    description: str
    quantity: int
    price: float
    order: Optional[int] = None

    @classmethod
    def as_form(
        cls,
        title: str = Form(...),
        description: str = Form(...),
        quantity: int = Form(...),
        price: float = Form(...),
        order: Optional[int] = Form(None),
    ):
        return cls(
            title=title,
            description=description,
            quantity=quantity,
            price=price,
            order=order,
        )
