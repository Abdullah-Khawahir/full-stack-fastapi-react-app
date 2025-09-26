FROM node:20-alpine

RUN apk add --no-cache npm nodejs sed

WORKDIR /app

COPY ./package*.json .

RUN npm install

COPY . .

RUN sed -i 's#http://localhost:8000/openapi.json#http://backend:8000/openapi.json#' ./package.json

EXPOSE 5173


CMD ["sh", "-c", "npm run api-gen && npm run dev -- --host 0.0.0.0 --port 5173"]
