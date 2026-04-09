FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all deps (including devDeps for build)
RUN npm install

# Copy source
COPY . .

# Build the Vite app
RUN npm run build

# Remove devDependencies
RUN npm prune --production

EXPOSE 3000

CMD ["node", "server.js"]
