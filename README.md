
# Dialect Backend V2

## Overview
This repository contains the project for Dialect Backend V2, which is a project management platform. This guide will walk you through installing Docker, setting up the necessary containers, and running the project locally.

## Prerequisites
Before running the project with Docker, ensure that you have the following installed on your system:

- **Docker**: Docker is used to create and manage containers for the application.
- **Docker Compose**: Docker Compose allows you to define and run multi-container Docker applications.

### Install Docker
Follow the steps below based on your operating system:

### 1. **Install Docker on Linux (Ubuntu)**
If you're using Linux, follow these steps to install Docker.

1. **Update the apt package index:**
   ```bash
   sudo apt-get update
   ```

2. **Install required dependencies:**
   ```bash
   sudo apt-get install apt-transport-https ca-certificates curl software-properties-common
   ```

3. **Add Docker’s official GPG key:**
   ```bash
   curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
   ```

4. **Set up the Docker stable repository:**
   ```bash
   sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
   ```

5. **Update the apt package index again:**
   ```bash
   sudo apt-get update
   ```

6. **Install Docker:**
   ```bash
   sudo apt-get install docker-ce
   ```

7. **Verify the installation:**
   ```bash
   sudo docker --version
   ```

8. **Optional: Allow Docker commands to be run as a non-root user:**
   ```bash
   sudo usermod -aG docker $USER
   ```

   Then log out and log back in for the changes to take effect.

### 2. **Install Docker on macOS**
1. **Download Docker Desktop for Mac from**: [Docker Desktop](https://www.docker.com/products/docker-desktop).
2. **Install Docker Desktop** by following the instructions.
3. **Verify the installation** by running the following in the terminal:
   ```bash
   docker --version
   ```

### 3. **Install Docker on Windows**
1. **Download Docker Desktop for Windows** from: [Docker Desktop](https://www.docker.com/products/docker-desktop).
2. **Install Docker Desktop** by following the instructions.
3. **Verify the installation** by running the following in the Command Prompt or PowerShell:
   ```bash
   docker --version
   ```

### Install Docker Compose
Docker Compose is used to define and manage multi-container applications. To install Docker Compose:

#### 1. **On Linux (Ubuntu)**
1. **Download the latest version of Docker Compose:**
   ```bash
   sudo curl -L "https://github.com/docker/compose/releases/download/$(curl -s https://api.github.com/repos/docker/compose/releases/latest | jq -r .tag_name)/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   ```

2. **Set the permissions:**
   ```bash
   sudo chmod +x /usr/local/bin/docker-compose
   ```

3. **Verify the installation:**
   ```bash
   docker-compose --version
   ```

#### 2. **On macOS / Windows**
Docker Compose comes pre-installed with Docker Desktop for macOS and Windows. Verify it by running:
```bash
docker-compose --version
```

## Running the Project Locally

Once Docker and Docker Compose are installed, you can set up the project locally by following the steps below.

### 1. **Clone the Repository**
Clone this repository to your local machine using the following command:
```bash
git clone https://github.com/yourusername/your-repo.git
cd your-repo
```

### 2. **Build and Start Containers**
Use Docker Compose to build and start the application.

1. **Build the images and start the containers:**
   ```bash
   docker-compose up --build
   ```

   This command will:
   - Build the Docker images from the `Dockerfile`.
   - Start the containers as defined in `docker-compose.yml`.

2. **Start containers in detached mode (optional):**
   ```bash
   docker-compose up -d
   ```

   This runs the containers in the background, so you can continue using the terminal.

3. **Check the status of your containers:**
   ```bash
   docker-compose ps
   ```

4. **Access the project:**
   - The NestJS backend should be running on port `3500`. Visit `http://localhost:3500` to access the API.
   - The Redis service will be running on port `6379`.

### 3. **Stopping the Containers**
To stop the containers, run the following command:
```bash
docker-compose down
```

This will stop and remove the containers, but will keep your data volumes intact.

To stop and remove everything (containers, networks, and volumes):
```bash
docker-compose down --volumes --remove-orphans
```

### 4. **Viewing Logs**
To view the logs of the running containers, use:
```bash
docker-compose logs
```

For logs from a specific service (e.g., `nestjs-backend`):
```bash
docker-compose logs nestjs-backend
```

### 5. **Accessing Redis**
You can access Redis via the command line or a Redis client. To access Redis from the container, run:
```bash
docker exec -it redis redis-cli
```

### Troubleshooting

- **Docker Compose Not Found**: Make sure Docker Compose is installed correctly and accessible in your terminal.
- **Permission Issues**: If you encounter permissions errors, try running the commands with `sudo` or ensure your user has the correct privileges for Docker.
- **Container Not Starting**: Check the logs with `docker-compose logs` to identify potential issues.

## Conclusion
With Docker and Docker Compose, you can easily set up and run the project in a containerized environment. This allows for easier management of dependencies and environments, making it simple to develop and test the application locally.

---