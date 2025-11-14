-- Insert default admin user (password: admin123 - should be changed in production)
-- Password is bcrypt hash of "admin123"
INSERT INTO users (email, password, first_name, last_name, department, role, enabled)
VALUES ('admin@company.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iwK8pJ5C', 'Admin', 'User', 'IT', 'ROLE_ADMIN', TRUE);

-- Insert sample fleet manager
INSERT INTO users (email, password, first_name, last_name, department, role, enabled)
VALUES ('fleet@company.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iwK8pJ5C', 'Fleet', 'Manager', 'Fleet Management', 'ROLE_ADMIN', TRUE);

-- Insert sample approver
INSERT INTO users (email, password, first_name, last_name, department, role, enabled)
VALUES ('approver@company.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iwK8pJ5C', 'Approver', 'Manager', 'Sales', 'ROLE_APPROVER', TRUE);

-- Insert sample employee
INSERT INTO users (email, password, first_name, last_name, department, cost_center, role, enabled)
VALUES ('employee@company.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iwK8pJ5C', 'John', 'Doe', 'Sales', 'CC001', 'ROLE_EMPLOYEE', TRUE);

-- Insert sample maintenance user
INSERT INTO users (email, password, first_name, last_name, department, role, enabled)
VALUES ('maintenance@company.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iwK8pJ5C', 'Maintenance', 'Staff', 'Fleet Management', 'ROLE_MAINTENANCE', TRUE);

