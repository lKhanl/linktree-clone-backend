# ==== CONFIGURE =====
# Use a Node 16 base image
FROM node:16-alpine
# Set the working directory to /app inside the container
RUN mkdir /app
WORKDIR /app
# Copy app files
COPY . .


# ==== BUILD =====
# Install dependencies (npm ci makes sure the exact versions in the lockfile gets installed)
RUN yarn install --immutable
# Build the app

RUN yarn build
# ==== RUN =======
# Set the env to "production"
ENV NODE_ENV production
# Expose the port on which the app will be running (3001 is the default that `serve` uses)
EXPOSE 4000
# Start the app
CMD [ "yarn", "preview"]