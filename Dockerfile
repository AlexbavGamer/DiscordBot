FROM node:latest
WORKDIR /app
COPY . .

RUN apt-get -y update
RUN apt-get -y upgrade
RUN apt-get install -y ffmpeg

RUN npm install
RUN npm install -g ts-node

CMD ["npm", "start"]