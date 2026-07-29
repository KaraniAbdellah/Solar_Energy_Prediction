FROM python:3.12-slim

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app/

COPY ./model main.py requirements.txt /app/
COPY pyproject.toml uv.lock ./


RUN uv add -r requirements.txt


CMD ["uv", "fastapi", "run", "dev"]


