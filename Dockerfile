FROM node:boron
WORKDIR /app
copy . .
CMD ["npm", "start"]