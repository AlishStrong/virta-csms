FROM node:16 as dev
WORKDIR /home/node/app
COPY api-backend/package*.json ./
RUN npm install
COPY api-backend .

FROM dev as prod
RUN npm run build