from src.database import Base, engine
from src.endpoints import item_route, media_route
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Items Dashboard App")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(item_route.router)
app.include_router(media_route.router)


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
