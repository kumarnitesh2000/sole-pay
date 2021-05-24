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
FROM nginx
COPY --from=front_builder /app/front/build/ /usr/share/nginx/html
COPY --from=landing_builder /app/landing/dist /usr/share/nginx/html/dist
RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx/frontend.conf /etc/nginx/conf.d/default.conf
CMD ["nginx","-g","daemon off;"]