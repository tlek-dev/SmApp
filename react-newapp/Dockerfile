FROM node:16

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Build the React app
RUN npm run build

# Expose the port
EXPOSE 3000

# Start the server
CMD ["node", "server/server.js"]
