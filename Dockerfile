FROM node:15.5.1-buster-slim

RUN apt-get update && apt-get install vim -y
RUN npm install -g expo-cli
RUN expo init URLGet --template blank
WORKDIR /URLGet/
COPY ./URLGet/ .

CMD [ "yarn","web" ]