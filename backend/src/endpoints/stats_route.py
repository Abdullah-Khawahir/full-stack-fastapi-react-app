from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy.sql import func

from src.dtos.stat_dto import ItemStatsResponseDTO
from src.schema.item_model import Item
from src.database import get_db


router = APIRouter(prefix="/stats", tags=["stats"])



@router.get('/items_stats', response_model=ItemStatsResponseDTO)
def items_stats(db: Session = Depends(get_db)):
    price_total = db.query(func.sum(Item.price * Item.quantity)).scalar() or 0
    count = db.query(Item).count() or 0
    total_pieces = db.query(func.sum(Item.quantity)).scalar() or 0
    avg_price = db.query(func.avg(Item.price)).scalar() or 0
    min_price = db.query(func.min(Item.price)).scalar() or 0
    max_price = db.query(func.max(Item.price)).scalar() or 0
    total_price_to_item_title = db.query(Item.title, func.sum(Item.price * Item.quantity) , Item.price, Item.quantity).group_by(Item.title).all() or []

    return {
        'avg_price': avg_price,
        'count': count,
        'max_price': max_price,
        'min_price': min_price,
        'price_total': price_total,
        'total_pieces': total_pieces,
        'total_price_to_item_title': [
            {'title': title, 'total_price': total_price , 'price':price , 'quantity':quantity}
                                      for title, total_price, price,quantity in total_price_to_item_title],
    }

