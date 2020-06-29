FROM node:boron
WORKDIR /app
COPY . .
CMD ["npm", "start"]