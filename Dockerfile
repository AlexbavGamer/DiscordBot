FROM node:slim
RUN mkdir -p /usr/src/app
RUN mkdir -p /usr/src/app/node_modules && chown -R node:node /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app
RUN dpkg --configure -a
RUN apt-get -f install
RUN apt-get --fix-missing install
RUN apt-get clean
RUN apt-get update
RUN apt-get upgrade
RUN apt-get dist-upgrade
RUN apt-get install build-essential
RUN apt-get clean
RUN apt-get autoremove
RUN add-apt-repository "deb http://archive.ubuntu.com/ubuntu $(lsb_release -sc) main universe"
RUN apt-get update || : && apt-get install build-essential checkinstall
RUN apt-get update || : && apt-get install python -y
RUN npm install -g typescript
RUN npm install
COPY . /usr/src/app
USER node
EXPOSE 3000
CMD  ["npm", "start"]