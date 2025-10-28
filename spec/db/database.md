# Database Schema

## Overview

Sealion uses MySQL as its database. The application stores todo items with group names, completion status and timestamps.

## Groups

Groups are hard-coded in the application and not stored in the database. The available groups are:
- **Uncategorized** (gray, #6B7280, inbox icon)
- **Shopping** (green, #10B981, shopping-cart icon)
- **Study** (blue, #3B82F6, book icon)
- **Work** (orange, #F59E0B, briefcase icon)
- **Personal** (purple, #8B5CF6, user icon)

## Tables

### todos

Todo items table storing all todo list entries.

| Column      | Type         | Null | Default           | Description                           |
|-------------|--------------|------|-------------------|---------------------------------------|
| id          | INT          | NO   | AUTO_INCREMENT    | Primary key                           |
| title       | VARCHAR(255) | NO   | -                 | Todo title/description                |
| completed   | BOOLEAN      | NO   | FALSE             | Completion status (true/false)        |
| group       | VARCHAR(100) | NO   | -                 | Group name                            |
| created_at  | TIMESTAMP    | NO   | CURRENT_TIMESTAMP | Record creation timestamp             |
| updated_at  | TIMESTAMP    | NO   | CURRENT_TIMESTAMP | Last update timestamp (auto-updated)  |

#### Indexes

- **PRIMARY KEY**: `id`
- **INDEX** `idx_completed`: on `completed` column for filtering
- **INDEX** `idx_created_at`: on `created_at` column for sorting
- **INDEX** `idx_group`: on `group` column for filtering by group

#### Table Configuration

- **Engine**: InnoDB
- **Character Set**: utf8mb4
- **Collation**: utf8mb4_unicode_ci

## Setup

To create the tables, run:

```bash
mysql -u root -p [database_name] < spec/db/schema.sql
```

## Notes

- Groups are hard-coded in the application configuration and cannot be modified through the API
- Each **todo** has a **group** name that must match one of the predefined groups
- The `updated_at` column automatically updates to the current timestamp when a record is modified
- UTF-8 character encoding supports international characters and emojis
- Indexes on `completed` and `created_at` improve query performance for common operations
