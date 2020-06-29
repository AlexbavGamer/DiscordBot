FROM node:boron
WORKDIR /app
COPY . .
RUN npm install -g
CMD ["npm", "start"]