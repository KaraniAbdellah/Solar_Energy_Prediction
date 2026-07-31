FROM python:3.12-slim

WORKDIR /app/

COPY requirements.txt ./

# RUN uv sync --locked - this command creates .venv
RUN pip install -r requirements.txt

# Copy Other Files
COPY . .

# Container will runing in 8000 port
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
