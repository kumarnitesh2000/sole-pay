FROM node:16.14.2
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
WORKDIR /app
COPY . .
EXPOSE 4000
CMD [ "node", "index.js" ]
