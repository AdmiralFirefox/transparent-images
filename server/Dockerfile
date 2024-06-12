FROM python:3.11-slim AS flask

WORKDIR /app

# Install curl
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Copy all Files
COPY . .

RUN pip install --no-cache-dir -r requirements.txt

# Download the u2net.onnx file
RUN mkdir -p /root/.u2net && \
    curl -L -o /root/.u2net/u2net.onnx https://github.com/danielgatis/rembg/releases/download/v0.0.0/u2net.onnx

# Set the Flask application entry point
ENV FLASK_APP=main.py

EXPOSE 8000

# Command to start the Flask server using Gunicorn
CMD ["gunicorn", "-b", "0.0.0.0:8000", "main:app"]