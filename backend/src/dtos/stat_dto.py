from pydantic import BaseModel
from typing import List

class TotalPricesTable(BaseModel):
    title: str
    total_price: float
    price:float
    quantity:int

class ItemStatsResponseDTO(BaseModel):
    avg_price: float
    count: int
    max_price: float
    min_price: float
    price_total: float
    total_price_to_item_title: List[TotalPricesTable]
    total_pieces: int

