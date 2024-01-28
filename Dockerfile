# Use a Node.js base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and yarn.lock to the working directory
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Expose the port on which the Nest.js app will run
EXPOSE 8000

# Command to start the Nest.js app
CMD [ "yarn", "start:dev" ]
