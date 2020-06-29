FROM node:boron
WORKDIR /app
COPY . .
RUN npm -g config user root
RUN npm -g install ts-node
CMD ["npm", "start"]