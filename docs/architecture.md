# Enterprise Car Share - Architecture Documentation

## Overview

Enterprise Car Share is an internal corporate car rental and sharing management system built with Spring Boot (backend) and React (frontend).

## System Architecture

### High-Level Architecture

```
┌─────────────────┐
│   React Frontend │
│   (Port 3000)   │
└────────┬────────┘
         │ HTTP/REST
         │ JWT Auth
         ▼
┌─────────────────┐
│  Spring Boot    │
│  (Port 8080)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   PostgreSQL    │
│   (Port 5432)   │
└─────────────────┘
```

## Backend Architecture

### Technology Stack
- **Framework**: Spring Boot 3.2.0
- **Language**: Java 17
- **Database**: PostgreSQL
- **ORM**: Spring Data JPA / Hibernate
- **Security**: Spring Security with JWT
- **API Documentation**: Springdoc OpenAPI (Swagger)
- **Migration**: Flyway

### Package Structure

```
com.enterprise.carshare/
├── config/          # Configuration classes
├── controller/       # REST controllers
├── domain/          # JPA entities
├── dto/             # Data Transfer Objects
├── mapper/          # MapStruct mappers
├── repository/      # JPA repositories
├── security/        # Security configuration
├── service/         # Business logic
└── util/            # Utility classes
```

### Key Components

#### 1. Domain Layer (Entities)
- `User`: User accounts with roles
- `Vehicle`: Vehicle information and status
- `Booking`: Booking requests and status
- `BookingUsage`: Check-in/check-out tracking
- `MaintenanceTask`: Vehicle maintenance records

#### 2. Service Layer
- `AuthService`: Authentication and authorization
- `VehicleService`: Vehicle CRUD operations
- `BookingService`: Booking management and validation
- `MaintenanceService`: Maintenance task management
- `ReportService`: Analytics and reporting

#### 3. Controller Layer
- RESTful API endpoints
- Request validation
- Response mapping

#### 4. Security
- JWT-based authentication
- Role-based access control (RBAC)
- Password encryption (BCrypt)

## Frontend Architecture

### Technology Stack
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **State Management**: React Query
- **Routing**: React Router v6
- **HTTP Client**: Axios

### Project Structure

```
src/
├── components/      # Reusable components
│   ├── layout/     # Layout components
│   ├── common/     # Common UI components
│   └── bookings/   # Booking-specific components
├── context/        # React contexts (Auth)
├── hooks/          # Custom React hooks
├── pages/          # Page components
├── routes/         # Routing configuration
├── services/       # API service clients
├── styles/         # Global styles
└── types/          # TypeScript type definitions
```

## Database Schema

### Core Tables

1. **users**: User accounts and authentication
2. **vehicles**: Vehicle inventory
3. **bookings**: Booking requests
4. **booking_usage**: Check-in/check-out data
5. **maintenance_tasks**: Maintenance records
6. **vehicle_documents**: Document storage metadata
7. **vehicle_photos**: Photo storage metadata

### Relationships

- User → Bookings (One-to-Many)
- Vehicle → Bookings (One-to-Many)
- Booking → BookingUsage (One-to-One)
- Vehicle → MaintenanceTasks (One-to-Many)

## API Design

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Vehicle Endpoints
- `GET /api/vehicles` - List vehicles (paginated)
- `GET /api/vehicles/available` - List available vehicles
- `GET /api/vehicles/{id}` - Get vehicle details
- `POST /api/vehicles` - Create vehicle (Admin only)
- `PUT /api/vehicles/{id}` - Update vehicle (Admin only)
- `DELETE /api/vehicles/{id}` - Delete vehicle (Admin only)

### Booking Endpoints
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my-bookings` - Get user's bookings
- `GET /api/bookings` - Get all bookings (Admin/Approver)
- `GET /api/bookings/{id}` - Get booking details
- `POST /api/bookings/{id}/approve` - Approve booking
- `POST /api/bookings/{id}/reject` - Reject booking
- `POST /api/bookings/{id}/cancel` - Cancel booking
- `POST /api/bookings/{id}/checkout` - Checkout vehicle
- `POST /api/bookings/{id}/checkin` - Checkin vehicle

### Maintenance Endpoints
- `GET /api/maintenance` - List maintenance tasks
- `GET /api/maintenance/vehicle/{vehicleId}` - Get tasks for vehicle
- `POST /api/maintenance` - Create maintenance task
- `PATCH /api/maintenance/{id}/status` - Update task status

### Report Endpoints
- `GET /api/reports/usage` - Usage statistics (Admin only)

## Security

### Authentication Flow
1. User submits credentials
2. Backend validates and generates JWT
3. Frontend stores JWT in localStorage
4. Subsequent requests include JWT in Authorization header
5. Backend validates JWT on each request

### Roles
- `ROLE_ADMIN`: Full system access
- `ROLE_EMPLOYEE`: Create bookings, view own bookings
- `ROLE_APPROVER`: Approve/reject bookings
- `ROLE_MAINTENANCE`: Manage maintenance tasks

## Deployment

### Environment Variables

**Backend:**
- `DB_URL`: PostgreSQL connection URL
- `DB_USERNAME`: Database username
- `DB_PASSWORD`: Database password
- `JWT_SECRET`: JWT signing secret
- `CORS_ORIGINS`: Allowed CORS origins

**Frontend:**
- `VITE_API_BASE_URL`: Backend API URL

### Docker Support

See `infra/docker-compose.yml` for containerized deployment.

## Future Enhancements

1. **Mobile App**: React Native or Flutter mobile application
2. **SSO Integration**: Keycloak or Azure AD integration
3. **Real-time Notifications**: WebSocket or Server-Sent Events
4. **Email/SMS Notifications**: Integration with notification services
5. **File Storage**: AWS S3 or similar for documents/photos
6. **Advanced Reporting**: More detailed analytics and dashboards
7. **Calendar View**: Visual booking calendar
8. **Recurring Bookings**: Support for regular bookings

