import uuid
from sqlalchemy import Column, DateTime, String, Float, Integer
from sqlalchemy.dialects.postgresql import UUID
from ..database import Base

class Item(Base):
    __tablename__ = "items"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order = Column(Integer, autoincrement=True)
    title = Column(String)
    description = Column(String)
    price = Column(Float)
    quantity = Column(Integer)
    file_uri = Column(String)
    date = Column(DateTime)
    file_mime_type = Column(String)
