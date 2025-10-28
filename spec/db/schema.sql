-- Sealion Database Schema
-- MySQL Database Schema for Todo List Application

-- Groups table
CREATE TABLE IF NOT EXISTS sealion_groups (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  color VARCHAR(7) NOT NULL,
  icon VARCHAR(50) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Todos table
CREATE TABLE IF NOT EXISTS sealion_todos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  group_id INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_completed (completed),
  INDEX idx_created_at (created_at),
  INDEX idx_group_id (group_id),
  FOREIGN KEY (group_id) REFERENCES sealion_groups(id) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed default groups
INSERT INTO sealion_groups (name, color, icon) VALUES
  ('Uncategorized', '#6B7280', 'inbox'),
  ('Shopping', '#10B981', 'shopping-cart'),
  ('Study', '#3B82F6', 'book'),
  ('Work', '#F59E0B', 'briefcase'),
  ('Personal', '#8B5CF6', 'user')
ON DUPLICATE KEY UPDATE name=name;
