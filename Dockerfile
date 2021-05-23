# builder name is given to frontend stage in multi-stage process
FROM node:10 AS builder
WORKDIR /app
COPY . .
RUN npm install && npm run build


# second stage is for nginx to serve the files
FROM nginx
COPY --from=builder /app/build/ /usr/share/nginx/html
COPY ../nginx/nginx.conf /etc/nginx/conf.d/default.conf
