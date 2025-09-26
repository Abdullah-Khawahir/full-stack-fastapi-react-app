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
uvicorn src.main:app --port 8000  # Important: Set the port to 8000 or update it in the frontend/package.json
```

Frontend
```sh
cd frontend
npm install
npm run api-gen
npm run dev
```


