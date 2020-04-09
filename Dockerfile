FROM node:latest
RUN mkdir -p /usr/src/app
RUN mkdir -p /usr/src/app/node_modules && chown -R node:node /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app
RUN npm install -g typescript
RUN npm install
COPY . /usr/src/app
USER node
EXPOSE 3000
CMD ["npm", "start"]