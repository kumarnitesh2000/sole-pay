FROM node:16.14.2
ARG PRIVATE_DOCKER
ARG PUBLIC_DOCKER
ENV PRIVATE_DOCKER=$PRIVATE_DOCKER  
ENV PUBLIC_DOCKER=$PUBLIC_DOCKER
ENV NODE_ENV=prod
ARG URI
ENV URI=$URI
ENV PORT=4000
ENV UPI_PAYMENT_LINK_BASE=upi://pay?
ENV BASE_URL=ghouse-payment-nodejs-urtjok3rza-wl.a.run.app
ENV PASSPHRASE=testphrase
ENV PRIVATE_PEM_FILE_PATH=/test/resources/private.pem
ENV PUBLIC_PEM_FILE_PATH=/test/resources/public.pem
ENV ADMIN_USERNAME=username
ENV ADMIN_PASSWORD=password
ENV ADMIN_APP_ID=623849d051491b1681028757
ENV ADMIN_APP_SECRET=6d0e82d5c2d07b268571d295dd47271c
ENV MOCKPAY_URL=https://ghouse-payment-gw-urtjok3rza-wl.a.run.app/paylink/bill/generate
ENV MOCKPAY_TOKEN=YWRtaW46VGVzdEAxMjM=
  
WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

WORKDIR /app/certs
RUN touch private.pem
RUN touch public.pem
RUN echo $PRIVATE_DOCKER > private.pem
RUN echo $PUBLIC_DOCKER > public.pem

WORKDIR /app
COPY . .
EXPOSE 4000
CMD [ "node", "index.js" ]
