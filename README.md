# Distributed Message Broker

This project demonstrates a simple distributed architecture for handling heavy background tasks (video processing simulation) without blocking the user-facing API.

It uses:

- Nginx as a load balancer
- Two Express API servers (producers)
- RabbitMQ as the message broker
- One worker service (consumer)

## Architecture

1. Client sends request to Nginx.
2. Nginx balances requests between app_server_1 and app_server_2.
3. The selected app server publishes a video task to RabbitMQ queue video_queue.
4. The background worker consumes tasks and processes them asynchronously.

This keeps API responses fast, even while heavy work is still running.

## Project Structure

- producer.js: Express API that sends tasks to RabbitMQ.
- consumer.js: Worker that consumes and processes queued tasks.
- nginx.conf: Nginx upstream and reverse proxy config.
- docker-compose.yml: Full multi-service orchestration.
- Dockerfile: Shared Node.js image for producer and consumer services.

## Prerequisites

- Docker
- Docker Compose

## Run The Project

From the project root:

```bash
docker compose up --build
```

If your environment uses the legacy command, use:

```bash
docker-compose up --build
```

## Access Points

- App entrypoint through Nginx: http://localhost/

Each GET request to / simulates an upload and enqueues a video processing task.

## Expected Logs

Producer logs (app servers):

- Sent task <id> to Broker.

Worker logs:

- Worker is waiting for videos to compress...
- Compressing video ID: <id>...
- Done with <id>!

## Stop Services

```bash
docker compose down
```

## Troubleshooting

- If startup fails, ensure Docker daemon is running.
- If app servers fail to connect to broker, restart with a clean build:

```bash
docker compose down
docker compose up --build
```

- If port 80 is already in use, either stop the conflicting process or change the mapped port in docker-compose.yml.

## Why This Design

- Better responsiveness: request/response is decoupled from heavy processing.
- Better scalability: scale producers and workers independently.
- Better resilience: queue buffers traffic spikes and smooths load.
