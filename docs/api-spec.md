# API Specification

## Base URL
`http://localhost:8080/api`

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### Register
```
POST /auth/register
Content-Type: application/json

{
  "email": "user@company.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "department": "Sales",
  "costCenter": "CC001"
}

Response: 200 OK
{
  "token": "jwt_token_here",
  "type": "Bearer",
  "id": 1,
  "email": "user@company.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "ROLE_EMPLOYEE"
}
```

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "user@company.com",
  "password": "password123"
}

Response: 200 OK
{
  "token": "jwt_token_here",
  "type": "Bearer",
  "id": 1,
  "email": "user@company.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "ROLE_EMPLOYEE"
}
```

### Vehicles

#### List Vehicles
```
GET /vehicles?page=0&size=10&sortBy=id&direction=asc

Response: 200 OK
{
  "content": [...],
  "page": 0,
  "size": 10,
  "totalElements": 50,
  "totalPages": 5,
  "first": true,
  "last": false
}
```

#### Get Available Vehicles
```
GET /vehicles/available?page=0&size=10&department=Sales&vehicleType=CAR

Response: 200 OK
{
  "content": [...],
  "page": 0,
  "size": 10,
  "totalElements": 20,
  "totalPages": 2,
  "first": true,
  "last": false
}
```

#### Create Vehicle (Admin only)
```
POST /vehicles
Authorization: Bearer <token>
Content-Type: application/json

{
  "plateNumber": "ABC-123",
  "brand": "Toyota",
  "model": "Camry",
  "year": 2023,
  "color": "White",
  "vehicleType": "CAR",
  "fuelType": "PETROL",
  "capacity": 5,
  "vin": "VIN123456",
  "departmentOwner": "Sales",
  "costCenter": "CC001"
}

Response: 200 OK
{
  "id": 1,
  "plateNumber": "ABC-123",
  ...
}
```

### Bookings

#### Create Booking
```
POST /bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "vehicleId": 1,
  "startDateTime": "2024-01-15T09:00:00",
  "endDateTime": "2024-01-15T17:00:00",
  "pickupLocation": "Office A",
  "returnLocation": "Office A",
  "purpose": "Client visit"
}

Response: 200 OK
{
  "id": 1,
  "vehicleId": 1,
  "status": "PENDING",
  ...
}
```

#### Get My Bookings
```
GET /bookings/my-bookings?page=0&size=10
Authorization: Bearer <token>

Response: 200 OK
{
  "content": [...],
  "page": 0,
  "size": 10,
  ...
}
```

#### Approve Booking (Admin/Approver only)
```
POST /bookings/{id}/approve
Authorization: Bearer <token>

Response: 200 OK
{
  "id": 1,
  "status": "APPROVED",
  ...
}
```

#### Checkout
```
POST /bookings/{id}/checkout
Authorization: Bearer <token>
Content-Type: application/json

{
  "startMileage": 50000,
  "startFuelLevel": 80.5,
  "checkoutComments": "Vehicle in good condition"
}

Response: 200 OK
{
  "id": 1,
  "bookingId": 1,
  "startMileage": 50000,
  ...
}
```

#### Checkin
```
POST /bookings/{id}/checkin
Authorization: Bearer <token>
Content-Type: application/json

{
  "endMileage": 50150,
  "endFuelLevel": 75.0,
  "damageReported": false,
  "checkinComments": "Trip completed successfully"
}

Response: 200 OK
{
  "id": 1,
  "bookingId": 1,
  "distanceTravelled": 150,
  ...
}
```

## Error Responses

### 400 Bad Request
```json
{
  "message": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "message": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal server error"
}
```

