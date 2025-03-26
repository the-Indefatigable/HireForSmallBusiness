# HireSmart - Big Talent, Small Business

A platform connecting small businesses with skilled professionals.

## Features

- User authentication and authorization
- Role-based access control (Employers and Candidates)
- Profile management for candidates
- Job posting and candidate search for employers
- File upload support for resumes and profile photos
- Responsive and modern UI

## Prerequisites

- Docker and Docker Compose
- Git

## Deployment

1. Clone the repository:
```bash
git clone <your-repository-url>
cd HireSmart
```

2. Create a `.env` file in the root directory with the following variables:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

3. Build and start the containers:
```bash
docker-compose up --build
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- PostgreSQL: localhost:5432

## Development

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

### Backend Development
```bash
cd backend
./gradlew bootRun
```

## Architecture

- Frontend: Next.js with TypeScript
- Backend: Spring Boot with Java
- Database: PostgreSQL
- File Storage: Local filesystem (configurable)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 