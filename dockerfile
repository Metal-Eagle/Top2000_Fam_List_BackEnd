FROM node:13

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm i

COPY . .

CMD [ "node", "src/app.js" ]