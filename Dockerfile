FROM node:slim
WORKDIR /app
COPY . .
RUN npm install
RUN npm install -g ts-node

RUN apk add --update wget unzip libcurl \
   && apk add python3 python3-dev ffmpeg opus-dev \
   && wget https://bootstrap.pypa.io/get-pip.py && python3 ./get-pip.py \
   && python3 ./get-pip.py \
   && apk add gcc make libc-dev binutils libffi-dev \
   && apk add bash \
   && apk del wget gcc make git \
   && rm -rf /var/lib/apt/lists/* -y
CMD ["npm", "start"]