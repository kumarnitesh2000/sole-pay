# front_builder name is given to frontend stage in multi-stage process
FROM node:10-alpine AS front_builder
WORKDIR /app/front
COPY ./sole-pay-front .
RUN npm install && npm run build

# landing_builder name is given to landing stage in multi-stage process
FROM node:10-alpine AS landing_builder
WORKDIR /app/landing
COPY ./sole-pay-landing .
RUN npm install && npm i -g parcel-bundler && npm run build

# second stage is for nginx to serve the files
FROM nginx:1.15.8-alpine
RUN rm -rf /usr/share/nginx/html/index.html
COPY --from=front_builder /app/front/build/ /usr/share/nginx/html
COPY --from=landing_builder /app/landing/dist /usr/share/nginx/html/dist
RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx/* /etc/nginx/conf.d/
ENV SERVER_NAME example.com
RUN sed -i "s|\${SERVER_NAME}|${SERVER_NAME}|g" /etc/nginx/conf.d/http.conf
CMD ["nginx","-g","daemon off;"]
