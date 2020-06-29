FROM node:slim
WORKDIR /app
COPY . .
RUN apt-get -y update && apt-get install -y wget nano git build-essential yasm pkg-config

RUN git clone https://github.com/FFmpeg/FFmpeg /root/ffmpeg && \
    cd /root/ffmpeg && \
    ./configure --enable-nonfree --disable-shared --extra-cflags=-I/usr/local/include && \
    make -j8 && make install -j8

RUN npm install
RUN npm install -g ts-node

CMD ["npm", "start"]