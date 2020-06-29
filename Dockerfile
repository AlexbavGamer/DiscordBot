FROM node:boron
WORKDIR /app
COPY . .
RUN npm install
CMD ["npm", "start"]