# Swiftcart API
A RESTful API for managing a shopping cart, built with Express and Sequelize. It allows users to browse products, add and remove items from their cart and complete purchases. The database management is powered by Neon DB.

## Setup Instructions

### 1.Clone the repository

git clone https://github.com/jimmybcoding/swiftCartAPI.git

cd swiftCartAPI

### 2.Install the dependencies

npm install

### 3.Configure environmental variable

Create a new Neon database: https://neon.tech

Copy the connection string

Create a .env file in the project root and paste the connection string:

DATABASE_URL=neon-connection-string-here

### 4.Run the migrations

npx sequelize db:migrate

### 5.Run the seeder

npx sequelize db:seed:all

### 6.Start the server

nodemon index.js

### API Testing

Open API_TEST.rest

Send first GET request - List available products

Copy one of the product_id values from the response and change all occurances of product_id to this value

Send first POST request - Create a shopping cart

Copy the shoppingcart_id from the response and change all occurances of shoppingcart_id to this value

Now all other endpoints should be functional

## Docker Instructions

After doing the above you can now:

### 1.Build the Docker image using the Dockerfile

docker build -t swiftcart-api .

### 2.Start the app and PostgreSQL database using docker-compose.yml 

docker-compose up 

### 3. Access the app on localhost:3000

Once the above steps are up and running, you can access the API at: http://localhost:3000

To stop the Docker containers:

docker-compose down