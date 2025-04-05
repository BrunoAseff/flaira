# Flaira

This is a **flight search platform**, where users can search and get real-time flight information.

⚙️ **Overengineered on purpose** — I'm using this project to learn DevOps, AWS, backend, and infrastructure. Expect way more complexity than necessary.

## What will it do in the future

- Search and list flight data.
- Show flights on a real-time map (using Flight Radar API).
- User accounts for saving searches.

🏗️ Infra (a.k.a. the unnecessarily elaborate plumbing)

- Everything runs in Docker, because of course it does.
- GitHub Actions builds and ships the backend image to AWS ECR, like a good little automation robot.
- Once it lands there, ECS picks it up and runs it.
- The backend chats with a PostgreSQL database hosted on RDS, because plain old SQLite would’ve been too easy.
- The frontend is on Vercel, and it connects to the backend on ECS.
