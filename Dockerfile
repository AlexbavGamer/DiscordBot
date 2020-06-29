FROM node:slim
WORKDIR /app
COPY . .
RUN apt-get -y update
RUN apt-get install python3 python3-dev ffmpeg node-opus -y

RUN npm install
RUN npm install -g ts-node

CMD ["npm", "start"]