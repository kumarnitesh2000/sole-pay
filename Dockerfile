# front_builder name is given to frontend stage in multi-stage process
FROM node:10 AS front_builder
WORKDIR /app/front
COPY ./sole-pay-front .
RUN npm install && npm run build

# landing_builder name is given to landing stage in multi-stage process
FROM node:10 AS landing_builder
WORKDIR /app/landing
COPY ./sole-pay-landing .
RUN npm install && npm run dev

# second stage is for nginx to serve the files
FROM nginx
COPY --from=front_builder /app/front/build/ /usr/share/nginx/html
COPY ../nginx/nginx.conf /etc/nginx/conf.d/default.conf
