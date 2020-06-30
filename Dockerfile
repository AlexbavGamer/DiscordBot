FROM node:slim
WORKDIR /app
COPY . .

RUN set -x \
    && add-apt-repository ppa:mc3man/trusty-media \
    && apt-get update \
    && apt-get dist-upgrade \
    && apt-get install -y --no-install-recommends \
        ffmpeg
        
RUN npm install
RUN npm install -g ts-node

CMD ["npm", "start"]