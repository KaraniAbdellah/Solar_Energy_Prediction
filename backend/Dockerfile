FROM python:3.12-slim

WORKDIR /app/

COPY requirements.txt ./

# RUN uv sync --locked - this command creates .venv
RUN pip install -r requirements.txt

# Copy Other Files
COPY . .

# Container will runing in 8000 port
EXPOSE 8080



# My Docker Container Listen to 0.0.0.0 = any. not just 127.0.0.1
CMD ["uvicorn", "main:app", "--host=0.0.0.0", "--port=8080"]
