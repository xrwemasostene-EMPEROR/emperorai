# Use an official lightweight Node runtime as a parent image
FROM node:24-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json to install dependencies first
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Expose the internal port your server listens to
EXPOSE 3000

# Command to run your app
CMD ["node", "index.js"]
