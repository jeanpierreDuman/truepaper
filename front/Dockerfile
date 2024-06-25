FROM node:latest as dev-stage

WORKDIR  /app

COPY package*.json ./

RUN npm install

COPY . .

CMD npm start --host 127.0.0.1 --port 3000 --disableHostCheck true