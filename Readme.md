# how to start the sole pay application

## Build the Image 
```
in root directory Dockerfile for client side / proxy
in root directory / payment_module for backend
```

## Run the Container
```
sudo docker network create solepay-network
# payment_module_backend
sudo docker run --network solepay-network --name backend --env-file ./payment_module/dev.env -d backend
# client side -> proxy
sudo docker run --network solepay-network -d -p 80:80 -e SERVER_NAME=ec2-13-233-93-204.ap-south-1.compute.amazonaws.com clientside
```
