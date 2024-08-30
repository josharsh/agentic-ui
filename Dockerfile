# Use an official Node runtime as a parent image
FROM node:18

# Set the working directory
WORKDIR /usr/src/app

ARG NEXT_PUBLIC_AWS_ACCESS_KEY
ARG NEXT_PUBLIC_AWS_SECRET_KEY
ARG NEXT_PUBLIC_AWS_REGION_NAME
ARG NEXT_PUBLIC_AWS_S3_BUCKET_NAME
ARG NEXT_PUBLIC_API_URL

# Install pnpm
RUN npm install -g pnpm@v8.14.0

# Copy package.json and other dependency-related files
COPY package*.json pnpm-lock.yaml ./

# Install project dependencies using pnpm
RUN pnpm install

# Copy the project files into the container
COPY . .

# Build the app
RUN pnpm run build

# Expose the port the app runs on
EXPOSE 3211

# Command to run the app
CMD ["sh", "-c", "PORT=3211 pnpm start"]
