# Database Schema

## Overview

Sealion uses MySQL as its database. The application stores todo items organized into groups (categories) with completion status and timestamps.

## Tables

### groups

Groups (categories) for organizing todos.

| Column      | Type         | Null | Default           | Description                           |
|-------------|--------------|------|-------------------|---------------------------------------|
| id          | INT          | NO   | AUTO_INCREMENT    | Primary key                           |
| name        | VARCHAR(100) | NO   | -                 | Group name (unique)                   |
| color       | VARCHAR(7)   | NO   | -                 | Hex color code (e.g., #FF5733)        |
| icon        | VARCHAR(50)  | NO   | -                 | Icon identifier for UI                |
| created_at  | TIMESTAMP    | NO   | CURRENT_TIMESTAMP | Record creation timestamp             |
| updated_at  | TIMESTAMP    | NO   | CURRENT_TIMESTAMP | Last update timestamp (auto-updated)  |

#### Indexes

- **PRIMARY KEY**: `id`
- **UNIQUE INDEX** `idx_name`: on `name` column (ensures unique group names)

#### Default Groups

The schema includes these default groups:
- **Uncategorized** (gray, inbox icon)
- **Shopping** (green, shopping-cart icon)
- **Study** (blue, book icon)
- **Work** (orange, briefcase icon)
- **Personal** (purple, user icon)

### todos

Todo items table storing all todo list entries.

| Column      | Type         | Null | Default           | Description                           |
|-------------|--------------|------|-------------------|---------------------------------------|
| id          | INT          | NO   | AUTO_INCREMENT    | Primary key                           |
| title       | VARCHAR(255) | NO   | -                 | Todo title/description                |
| completed   | BOOLEAN      | NO   | FALSE             | Completion status (true/false)        |
| group_id    | INT          | NO   | -                 | Foreign key to groups table           |
| created_at  | TIMESTAMP    | NO   | CURRENT_TIMESTAMP | Record creation timestamp             |
| updated_at  | TIMESTAMP    | NO   | CURRENT_TIMESTAMP | Last update timestamp (auto-updated)  |

#### Indexes

- **PRIMARY KEY**: `id`
- **INDEX** `idx_completed`: on `completed` column for filtering
- **INDEX** `idx_created_at`: on `created_at` column for sorting
- **INDEX** `idx_group_id`: on `group_id` column for filtering by group

#### Foreign Keys

- `group_id` → `groups(id)` - ON DELETE RESTRICT, ON UPDATE CASCADE

#### Table Configuration

- **Engine**: InnoDB
- **Character Set**: utf8mb4
- **Collation**: utf8mb4_unicode_ci

## Relationships

- Each **todo** belongs to exactly one **group** (via `group_id`)
- A **group** can have many **todos**
- Groups cannot be deleted if they have associated todos (RESTRICT)

## Setup

To create the tables, run:

```bash
mysql -u root -p [database_name] < spec/db/schema.sql
```

## Notes

- The `updated_at` column automatically updates to the current timestamp when a record is modified
- UTF-8 character encoding supports international characters and emojis
- Indexes on `completed` and `created_at` improve query performance for common operations
