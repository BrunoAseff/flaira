# Flaira

This is a **travel tracking platform**, where users can log and explore their trips in one place.

⚙️ **Overengineered on purpose** — I'm using this project to learn DevOps, AWS, backend, and infrastructure. Expect way more complexity than necessary.

## What will it do in the future

- Track trips.
- Store photos, videos, notes, and memories.
- Show trips on an interactive map.
- Create travel goals and view journey stats.

🏗️ Infra (a.k.a. the unnecessarily elaborate plumbing)

- Everything runs in Docker, because of course it does.
- GitHub Actions builds and ships the backend image to AWS ECR, like a good little automation robot.
- Once it lands there, ECS picks it up and runs it.
- The backend chats with a PostgreSQL database hosted on RDS, because plain old SQLite would’ve been too easy.
- The frontend is on Vercel, and it connects to the backend on ECS.
