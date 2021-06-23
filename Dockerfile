FROM node:16-slim

WORKDIR /usr/src/app

COPY src/* ./

RUN npm install

CMD [ "node", "." ]
