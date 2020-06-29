FROM node:boron
WORKDIR /app
COPY . .
RUN npm -g config user root
RUN npm -g install ts-node
RUN npm install
CMD ["npm", "start"]