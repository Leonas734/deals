# Pull official base image
FROM python:3.10.1-slim-buster

# Set working directory
WORKDIR /usr/src/backend

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Install system dependencies
RUN apt-get update \
  && apt-get -y install netcat gcc postgresql \
  && apt-get clean
  
# Install dependencies
RUN pip install --upgrade pip
COPY ./requirements.txt .
RUN pip install -r requirements.txt

# Copy over entrypoint.sh
COPY ./entrypoint.sh /usr/src/backend/entrypoint.sh
RUN chmod +x /usr/src/backend/entrypoint.sh

# Add all files to container
COPY . .

# Run entrypoint.sh
ENTRYPOINT ["/usr/src/backend/entrypoint.sh"]