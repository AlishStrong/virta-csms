FROM node:16 as dev
WORKDIR /home/node/app
COPY package*.json ./
RUN npm install
COPY . .

FROM dev as prod
RUN npm run build