# Flaira

This is a **travel tracking platform**, where users can log and explore their trips in one place.

⚙️ **Overengineered on purpose** — I'm using this project to learn DevOps, AWS, backend, and infrastructure. Expect way more complexity than necessary.

## What will it do in the future

- Track trips.
- Store photos, videos, notes, and memories.
- Show trips on an interactive map.
- Create travel goals and view journey stats.

🏗️ Infra

- Everything runs in Docker.
- GitHub Actions builds and ships the backend image to AWS ECR.
- Once it lands there, ECS picks it up and runs it.
- The backend connects to a PostgreSQL database hosted on RDS.
- S3 is used to store images, videos and other files.
- The frontend is on Vercel, and it connects to the backend on ECS.
