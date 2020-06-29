FROM node:slim
WORKDIR /app
COPY . .
RUN apk add --update wget unzip libcurl \
   && apk add python3 python3-dev ffmpeg opus-dev -y

RUN npm install
RUN npm install -g ts-node

CMD ["npm", "start"]