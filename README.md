# Talent Marketplace Platform

A modern talent marketplace platform built with Spring Boot and Next.js, connecting employers with potential candidates.

## Features

- User Authentication (Employers & Candidates)
- Candidate Profile Management
  - Professional information
  - Skills and expertise
  - Experience
  - Portfolio
- Employer Features
  - Browse candidate profiles
  - Send interview requests
  - Direct messaging with candidates
  - Track interview requests
- Candidate Features
  - Create and manage profile
  - Receive and respond to interview requests
  - Chat with potential employers
  - Track interview requests

## Tech Stack

### Backend
- Spring Boot 3.x
- PostgreSQL
- Spring Security (JWT)
- Spring Data JPA
- WebSocket (for chat functionality)
- Maven

### Frontend
- Next.js 14
- React
- TypeScript
- Tailwind CSS
- NextAuth.js
- Socket.io-client (for real-time chat)

## Project Structure

```
talent-marketplace/
├── backend/                 # Spring Boot application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/talentmarketplace/
│   │   │   │       ├── config/
│   │   │   │       ├── controller/
│   │   │   │       ├── model/
│   │   │   │       ├── repository/
│   │   │   │       ├── service/
│   │   │   │       └── security/
│   │   │   └── resources/
│   │   └── test/
│   └── pom.xml
└── frontend/               # Next.js application
    ├── src/
    │   ├── app/
    │   ├── components/
    │   ├── lib/
    │   └── types/
    ├── public/
    └── package.json
```

## Getting Started

### Prerequisites
- Java 17 or later
- Node.js 18 or later
- PostgreSQL
- Maven
- npm or yarn

### Backend Setup
1. Navigate to the backend directory
2. Configure PostgreSQL connection in `application.properties`
3. Run `mvn spring-boot:run`

### Frontend Setup
1. Navigate to the frontend directory
2. Install dependencies: `npm install`
3. Run development server: `npm run dev`

## Environment Variables

### Backend
- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `JWT_SECRET`
- `WEBSOCKET_ENDPOINT`

### Frontend
- `NEXT_PUBLIC_API_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `NEXT_PUBLIC_WEBSOCKET_URL` 