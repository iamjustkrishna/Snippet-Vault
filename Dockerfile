# Use the official Python slim image as the base image.
# The 'slim' variant is significantly smaller and more secure as it contains only the minimal OS packages needed to run Python.
FROM python:3.11-slim

# Set environment variables to optimize Python runtime in Docker:
# PYTHONDONTWRITEBYTECODE: Prevents Python from writing .pyc files to disk, saving space and avoiding permission issues.
# PYTHONUNBUFFERED: Prevents Python from buffering stdout and stderr, ensuring application logs are emitted directly to the console immediately.
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Set the working directory inside the container to /app. All subsequent commands will be run from here.
WORKDIR /app

# Copy only the requirements.txt file first.
# This is a crucial step for optimizing layer caching! If requirements.txt hasn't changed, Docker will use the cached layer for the expensive `pip install` step on subsequent builds, even if the application code has changed.
COPY requirements.txt .

# Install the Python dependencies specified in requirements.txt.
# The --no-cache-dir flag ensures pip doesn't save the downloaded packages locally, keeping the final Docker image size small.
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application directory into the container.
# We do this AFTER the pip install step so that modifying code (which happens often) doesn't invalidate the dependency cache (which happens rarely).
COPY ./app ./app

# Expose port 8000 to signal to Docker that the container listens on this port at runtime.
EXPOSE 8000

# Specify the default command to run the FastAPI application using Uvicorn.
# --host 0.0.0.0 binds the server to all network interfaces, which is strictly required for the service to be accessible outside the Docker container.
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
