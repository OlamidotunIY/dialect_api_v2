# Stage 1: Build Stage
FROM node:20 as builder

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the entire application code, including Prisma schema and environment file
COPY . .

# Copy the environment file for the build process
COPY .env.production .env

# Generate the Prisma Client
RUN npx prisma generate

# Build the NestJS application
RUN yarn build

# Stage 2: Production Stage
FROM node:20

WORKDIR /app

# Copy only necessary files from the builder stage
COPY --from=builder /app/package.json /app/yarn.lock ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.env .env

# Install production-only dependencies
RUN yarn install --frozen-lockfile --production

# Add bcrypt with proper build configuration
RUN yarn add bcrypt --build-from-source

# Expose the application port
EXPOSE 3000

# Start the application in production mode
CMD ["yarn", "start:prod"]
