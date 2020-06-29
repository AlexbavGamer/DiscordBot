FROM node:latest
WORKDIR /app
COPY . .
RUN npm install
RUN npm install -g ts-node
CMD ["npm", "start"]