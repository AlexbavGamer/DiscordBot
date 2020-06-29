FROM alpine:latest
COPY . /app
WORKDIR /app
RUN apt-get update && apt-get upgrade -y && \
    apt-get install -y nodejs
CMD ["npm", "start"]