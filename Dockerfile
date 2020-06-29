FROM node:slim
WORKDIR /app
COPY . .
RUN apt-get install python3 python3-dev ffmpeg opus-dev -y

RUN npm install
RUN npm install -g ts-node

CMD ["npm", "start"]