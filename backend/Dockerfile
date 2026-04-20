# Use Node.js
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all your backend code
COPY . .

# Expose the dynamically passed port
EXPOSE 8000

# Start the server (Using explicit file path due to script mismatch)
CMD ["node", "server.js"]
