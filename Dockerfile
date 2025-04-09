#Use the official Node.js image as the base image
FROM node:22

#Set working directory inside the container
WORKDIR /app

#
COPY package*.json ./

#Install dependencies
RUN npm install

#Copy your project files into the container
COPY . .

#Expose the port your application listens on
ENV PORT=3000

EXPOSE 3000

#Specify the command to run your application
CMD [ "npm", "start" ]