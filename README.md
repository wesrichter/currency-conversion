# NestJS RESTful Service with Redis & PostgreSQL

This project is a RESTful service built with **NestJS**, using **PostgreSQL** as the database and **Redis** for caching.

## Prerequisites

Ensure you have the following installed on your system:

- [Node.js (LTS)](https://nodejs.org/)
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

---

## Installation

### 1️⃣ Clone the Repository

```sh
git clone git@github.com:wesrichter/currency-conversion.git
cd currency-conversion
```

### 2️⃣ Install Dependencies

```sh
npm install
```

### 3️⃣ Start PostgreSQL & Redis with Docker Run the following command to spin up PostgreSQL, Redis:

```sh
docker-compose up -d
```

Alternatively you can install redis and postgres locally by running

```sh
brew install redis
brew services start redis
brew install postgressql
brew services start postgressql
```

- PostgreSQL on localhost:5432
- Redis on localhost:6379

```sh
npm run start:dev
```
