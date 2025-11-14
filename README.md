# Enterprise Car Share

Internal corporate car rental and sharing management system.

## Features

- **Vehicle Management**: Add, update, and manage company vehicles
- **Booking System**: Employees can book vehicles for business trips
- **Approval Workflow**: Optional approval process for bookings
- **Check-in/Check-out**: Track vehicle usage, mileage, and fuel
- **Maintenance Tracking**: Manage vehicle maintenance schedules
- **Role-Based Access**: Admin, Employee, Approver, and Maintenance roles
- **Reporting**: Usage statistics and analytics

## Tech Stack

### Backend
- Spring Boot 3.2.0
- Java 17
- PostgreSQL
- Spring Security (JWT)
- Flyway (Database Migrations)
- MapStruct
- Lombok

### Frontend
- React 18
- TypeScript
- Vite
- TailwindCSS
- React Query
- React Router v6
- Axios

## Getting Started

### Prerequisites
- Java 17+
- Maven 3.6+
- Node.js 18+
- PostgreSQL 15+

### Backend Setup

1. Create PostgreSQL database:
```sql
CREATE DATABASE carshare_db;
```

2. Update `backend/src/main/resources/application.yml` with your database credentials

3. Run the backend:
```bash
cd backend
./mvnw spring-boot:run
```

Backend will be available at `http://localhost:8080/api`

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start development server:
```bash
npm run dev
```

Frontend will be available at `http://localhost:3000`

### Default Credentials

After running migrations, you can login with:
- **Admin**: `admin@company.com` / `admin123`
- **Employee**: `employee@company.com` / `admin123`

## API Documentation

Once the backend is running, access Swagger UI at:
`http://localhost:8080/api/swagger-ui.html`

## Docker Deployment

```bash
cd infra
docker-compose up -d
```

## Project Structure

```
enterprise-car-share/
├── backend/          # Spring Boot backend
├── frontend/         # React frontend
├── docs/             # Documentation
└── infra/            # Docker configuration
```

## License

Internal use only.

