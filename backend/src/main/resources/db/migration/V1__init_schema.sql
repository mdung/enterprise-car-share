-- Users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    department VARCHAR(100),
    cost_center VARCHAR(100),
    role VARCHAR(50) NOT NULL DEFAULT 'ROLE_EMPLOYEE',
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_department ON users(department);

-- Vehicles table
CREATE TABLE vehicles (
    id BIGSERIAL PRIMARY KEY,
    plate_number VARCHAR(20) UNIQUE NOT NULL,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL,
    color VARCHAR(50),
    vehicle_type VARCHAR(50) NOT NULL, -- CAR, VAN, TRUCK
    fuel_type VARCHAR(50) NOT NULL, -- PETROL, DIESEL, ELECTRIC, HYBRID
    capacity INTEGER NOT NULL,
    vin VARCHAR(50) UNIQUE,
    department_owner VARCHAR(100),
    cost_center VARCHAR(100),
    status VARCHAR(50) NOT NULL DEFAULT 'AVAILABLE', -- AVAILABLE, IN_USE, MAINTENANCE, INACTIVE
    current_mileage BIGINT NOT NULL DEFAULT 0,
    last_service_date DATE,
    next_service_due DATE,
    insurance_expiry_date DATE,
    registration_expiry_date DATE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_vehicles_plate_number ON vehicles(plate_number);
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_vehicles_department ON vehicles(department_owner);
CREATE INDEX idx_vehicles_type ON vehicles(vehicle_type);

-- Bookings table
CREATE TABLE bookings (
    id BIGSERIAL PRIMARY KEY,
    vehicle_id BIGINT NOT NULL REFERENCES vehicles(id) ON DELETE RESTRICT,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    approver_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    start_date_time TIMESTAMP NOT NULL,
    end_date_time TIMESTAMP NOT NULL,
    pickup_location VARCHAR(255) NOT NULL,
    return_location VARCHAR(255) NOT NULL,
    purpose TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED, CANCELLED, COMPLETED
    approval_required BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_booking_dates CHECK (end_date_time > start_date_time)
);

CREATE INDEX idx_bookings_vehicle_id ON bookings(vehicle_id);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_approver_id ON bookings(approver_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_dates ON bookings(start_date_time, end_date_time);

-- Booking check-in/check-out tracking
CREATE TABLE booking_usage (
    id BIGSERIAL PRIMARY KEY,
    booking_id BIGINT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    start_mileage BIGINT,
    end_mileage BIGINT,
    start_fuel_level DECIMAL(5,2), -- percentage 0-100
    end_fuel_level DECIMAL(5,2),
    distance_travelled BIGINT, -- calculated: end_mileage - start_mileage
    damage_reported BOOLEAN NOT NULL DEFAULT FALSE,
    damage_description TEXT,
    pre_trip_photos TEXT[], -- array of file paths/URLs
    post_trip_photos TEXT[],
    checkout_comments TEXT,
    checkin_comments TEXT,
    checked_out_at TIMESTAMP,
    checked_in_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_booking_usage_booking_id ON booking_usage(booking_id);

-- Maintenance tasks table
CREATE TABLE maintenance_tasks (
    id BIGSERIAL PRIMARY KEY,
    vehicle_id BIGINT NOT NULL REFERENCES vehicles(id) ON DELETE RESTRICT,
    created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'OPEN', -- OPEN, IN_PROGRESS, DONE
    planned_date DATE,
    completed_date DATE,
    cost DECIMAL(10,2),
    workshop_name VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_maintenance_vehicle_id ON maintenance_tasks(vehicle_id);
CREATE INDEX idx_maintenance_status ON maintenance_tasks(status);
CREATE INDEX idx_maintenance_planned_date ON maintenance_tasks(planned_date);

-- Vehicle documents (optional - for storing document metadata)
CREATE TABLE vehicle_documents (
    id BIGSERIAL PRIMARY KEY,
    vehicle_id BIGINT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL, -- REGISTRATION, INSURANCE, INSPECTION, etc.
    file_path VARCHAR(500) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size BIGINT,
    uploaded_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_vehicle_documents_vehicle_id ON vehicle_documents(vehicle_id);
CREATE INDEX idx_vehicle_documents_type ON vehicle_documents(document_type);

-- Vehicle photos
CREATE TABLE vehicle_photos (
    id BIGSERIAL PRIMARY KEY,
    vehicle_id BIGINT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    photo_path VARCHAR(500) NOT NULL,
    photo_type VARCHAR(50), -- EXTERIOR, INTERIOR, DAMAGE, etc.
    uploaded_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_vehicle_photos_vehicle_id ON vehicle_photos(vehicle_id);

