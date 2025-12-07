FROM node:lts-alpine3.23

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm i

COPY . .

CMD [ "node", "src/app.js" ]