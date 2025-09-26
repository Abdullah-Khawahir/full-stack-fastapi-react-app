# Run Instructions

### With docker-compose
```sh
docker-compose build 
docker-compose up
```

### Manual
Backend
```sh
cd backend
pip install -r ./requirements.txt
uvicorn src.main:app --port 8000
```

Frontend
```sh
cd frontend
npm install
npm run dev
```


