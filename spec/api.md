# Sealion API Interface Definition

## Base URL

```
http://localhost:3001
```

## Common Response Codes

| Code | Description |
|------|-------------|
| 200  | OK - Request successful |
| 201  | Created - Resource created successfully |
| 204  | No Content - Request successful, no response body |
| 400  | Bad Request - Invalid request parameters |
| 404  | Not Found - Resource not found |
| 500  | Internal Server Error - Server error |

## Data Types

### Group

```typescript
{
  id: number;
  name: string;
  color: string;      // Hex color code (e.g., "#FF5733")
  icon: string;       // Icon identifier
  createdAt: string;  // ISO 8601 timestamp
  updatedAt: string;  // ISO 8601 timestamp
}
```

### Todo

```typescript
{
  id: number;
  title: string;
  completed: boolean;
  groupId: number;    // Foreign key to Group
  createdAt: string;  // ISO 8601 timestamp
  updatedAt: string;  // ISO 8601 timestamp
}
```

---

## System Endpoints

### Health Check

Check API server health status.

**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-26T07:30:00.000Z"
}
```

### API Info

Get API information.

**Endpoint:** `GET /`

**Response:**
```json
{
  "message": "Sealion API - Todo List Application"
}
```

---

## Groups API

### List All Groups

Get all available groups.

**Endpoint:** `GET /api/groups`

**Response:**
```json
[
  {
    "id": 1,
    "name": "Uncategorized",
    "color": "#6B7280",
    "icon": "inbox",
    "createdAt": "2025-10-26T07:00:00.000Z",
    "updatedAt": "2025-10-26T07:00:00.000Z"
  },
  {
    "id": 2,
    "name": "Shopping",
    "color": "#10B981",
    "icon": "shopping-cart",
    "createdAt": "2025-10-26T07:00:00.000Z",
    "updatedAt": "2025-10-26T07:00:00.000Z"
  }
]
```

### Get Group by ID

Get a specific group by ID.

**Endpoint:** `GET /api/groups/:id`

**Parameters:**
- `id` (path) - Group ID

**Response (200):**
```json
{
  "id": 1,
  "name": "Uncategorized",
  "color": "#6B7280",
  "icon": "inbox",
  "createdAt": "2025-10-26T07:00:00.000Z",
  "updatedAt": "2025-10-26T07:00:00.000Z"
}
```

**Response (404):**
```json
{
  "error": "Group not found"
}
```

### Create Group

Create a new group.

**Endpoint:** `POST /api/groups`

**Request Body:**
```json
{
  "name": "Fitness",
  "color": "#EF4444",
  "icon": "dumbbell"
}
```

**Response (201):**
```json
{
  "id": 6,
  "name": "Fitness",
  "color": "#EF4444",
  "icon": "dumbbell",
  "createdAt": "2025-10-26T07:30:00.000Z",
  "updatedAt": "2025-10-26T07:30:00.000Z"
}
```

**Response (400):**
```json
{
  "error": "Name is required"
}
```

### Update Group

Update an existing group.

**Endpoint:** `PUT /api/groups/:id`

**Parameters:**
- `id` (path) - Group ID

**Request Body (all fields optional):**
```json
{
  "name": "Health & Fitness",
  "color": "#DC2626",
  "icon": "heart"
}
```

**Response (200):**
```json
{
  "id": 6,
  "name": "Health & Fitness",
  "color": "#DC2626",
  "icon": "heart",
  "createdAt": "2025-10-26T07:30:00.000Z",
  "updatedAt": "2025-10-26T07:35:00.000Z"
}
```

**Response (404):**
```json
{
  "error": "Group not found"
}
```

### Delete Group

Delete a group (only if it has no todos).

**Endpoint:** `DELETE /api/groups/:id`

**Parameters:**
- `id` (path) - Group ID

**Response (204):**
No content

**Response (400):**
```json
{
  "error": "Cannot delete group with existing todos"
}
```

### Get Todos for Group

Get all todos belonging to a specific group.

**Endpoint:** `GET /api/groups/:id/todos`

**Parameters:**
- `id` (path) - Group ID

**Response (200):**
```json
[
  {
    "id": 1,
    "title": "Buy groceries",
    "completed": false,
    "groupId": 2,
    "createdAt": "2025-10-26T07:30:00.000Z",
    "updatedAt": "2025-10-26T07:30:00.000Z"
  }
]
```

**Response (404):**
```json
{
  "error": "Group not found"
}
```

---

## Todos API

### List All Todos

Get all todos.

**Endpoint:** `GET /api/todos`

**Response:**
```json
[
  {
    "id": 1,
    "title": "Buy groceries",
    "completed": false,
    "groupId": 2,
    "createdAt": "2025-10-26T07:30:00.000Z",
    "updatedAt": "2025-10-26T07:30:00.000Z"
  },
  {
    "id": 2,
    "title": "Read chapter 5",
    "completed": true,
    "groupId": 3,
    "createdAt": "2025-10-26T07:31:00.000Z",
    "updatedAt": "2025-10-26T07:32:00.000Z"
  }
]
```

### Get Todo by ID

Get a specific todo by ID.

**Endpoint:** `GET /api/todos/:id`

**Parameters:**
- `id` (path) - Todo ID

**Response (200):**
```json
{
  "id": 1,
  "title": "Buy groceries",
  "completed": false,
  "groupId": 2,
  "createdAt": "2025-10-26T07:30:00.000Z",
  "updatedAt": "2025-10-26T07:30:00.000Z"
}
```

**Response (404):**
```json
{
  "error": "Todo not found"
}
```

### Create Todo

Create a new todo.

**Endpoint:** `POST /api/todos`

**Request Body:**
```json
{
  "title": "Buy groceries",
  "groupId": 2
}
```

**Response (201):**
```json
{
  "id": 1,
  "title": "Buy groceries",
  "completed": false,
  "groupId": 2,
  "createdAt": "2025-10-26T07:30:00.000Z",
  "updatedAt": "2025-10-26T07:30:00.000Z"
}
```

**Response (400):**
```json
{
  "error": "Title is required"
}
```

**Response (400 - Invalid Group):**
```json
{
  "error": "Invalid group ID"
}
```

### Update Todo

Update an existing todo.

**Endpoint:** `PUT /api/todos/:id`

**Parameters:**
- `id` (path) - Todo ID

**Request Body (all fields optional):**
```json
{
  "title": "Buy groceries and supplies",
  "completed": true,
  "groupId": 1
}
```

**Response (200):**
```json
{
  "id": 1,
  "title": "Buy groceries and supplies",
  "completed": true,
  "groupId": 1,
  "createdAt": "2025-10-26T07:30:00.000Z",
  "updatedAt": "2025-10-26T07:35:00.000Z"
}
```

**Response (404):**
```json
{
  "error": "Todo not found or invalid group ID"
}
```

### Delete Todo

Delete a todo.

**Endpoint:** `DELETE /api/todos/:id`

**Parameters:**
- `id` (path) - Todo ID

**Response (204):**
No content

**Response (404):**
```json
{
  "error": "Todo not found"
}
```

---

## Default Groups

The following groups are available by default:

| ID | Name          | Color     | Icon          |
|----|---------------|-----------|---------------|
| 1  | Uncategorized | `#6B7280` | inbox         |
| 2  | Shopping      | `#10B981` | shopping-cart |
| 3  | Study         | `#3B82F6` | book          |
| 4  | Work          | `#F59E0B` | briefcase     |
| 5  | Personal      | `#8B5CF6` | user          |

---

## Error Handling

All error responses follow this format:

```json
{
  "error": "Error message description"
}
```

Common error scenarios:
- Missing required fields → 400 Bad Request
- Invalid IDs or references → 400 Bad Request or 404 Not Found
- Resource not found → 404 Not Found
- Server errors → 500 Internal Server Error

---

## CORS

The API supports Cross-Origin Resource Sharing (CORS) for all origins.

---

## Notes

1. All timestamps are in ISO 8601 format
2. The `groupId` field is required when creating todos
3. Groups cannot be deleted if they contain todos
4. The `completed` field defaults to `false` for new todos
5. Color codes should be valid hex colors (e.g., `#RRGGBB`)
