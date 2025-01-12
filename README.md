"# Blog-Application-Server" 
# Blog Backend Project

## Overview

This project is a backend for a blogging platform where users can write, update, and delete their own blogs. It includes role-based access control with two roles: **Admin** and **User**. Admin users have special permissions to manage users and their blogs, while regular users can only manage their own blogs. The system supports secure authentication, CRUD operations on blogs, and includes a public API for fetching blogs with search, sort, and filter functionalities.

## Technologies

- **TypeScript**
- **Node.js**
- **Express.js**
- **MongoDB** with **Mongoose**
  
## Features and Requirements

### 1. User Roles

#### Admin
- Admins are created manually with predefined credentials.
- Can delete any blog.
- Can block any user by updating the `isBlocked` property.
- Cannot update any blog.
- Admin email: 
- Admin password: 

#### User
- Can register and log in to the platform.
- Can create, update, and delete their own blogs.
- Cannot perform admin actions.

### 2. Authentication & Authorization
- **Authentication**: Users must log in to perform write, update, and delete operations.
- **Authorization**: Admin and User roles are differentiated and securely managed.

### 3. Blog API
- A public API for reading blogs, which includes the blog title, content, and author details.
- Supports search, sorting, and filtering of blogs.

## Models

### User Model

```typescript
{
  name: string,           // The full name of the user.
  email: string,          // The email address of the user, used for authentication and communication.
  password: string,       // The password for the user, securely stored.
  role: "admin" | "user", // The role of the user. Default is "user".
  isBlocked: boolean,     // A flag indicating if the user is blocked. Default is false.
  createdAt: Date,        // Timestamp when the user was created.
  updatedAt: Date         // Timestamp of the last update to the user.
}
```

### Blog Model

```typescript
{
  title: string,          // The title of the blog post.
  content: string,        // The content or body of the blog post.
  author: ObjectId,       // Reference to the User model, indicating the author of the blog post.
  isPublished: boolean,   // Flag indicating if the blog post is published. Default is true.
  createdAt: Date,        // Timestamp when the blog post was created.
  updatedAt: Date         // Timestamp of the last update to the blog post.
}
```

## API Endpoints

### 1. Authentication

#### 1.1 Register User

`POST /api/auth/register`

Registers a new user on the platform.

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response**:
- Success (201):
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "statusCode": 201,
    "data": {
      "_id": "string",
      "name": "string",
      "email": "string"
    }
  }
  ```

- Failure (400):
  ```json
  {
    "success": false,
    "message": "Validation error",
    "statusCode": 400,
    "error": { "details" },
    "stack": "error stack"
  }
  ```

#### 1.2 Login User

`POST /api/auth/login`

Authenticates a user and returns a JWT token.

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response**:
- Success (200):
  ```json
  {
    "success": true,
    "message": "Login successful",
    "statusCode": 200,
    "data": {
      "token": "string"
    }
  }
  ```

- Failure (401):
  ```json
  {
    "success": false,
    "message": "Invalid credentials",
    "statusCode": 401,
    "error": { "details" },
    "stack": "error stack"
  }
  ```

### 2. Blog Management

#### 2.1 Create Blog

`POST /api/blogs`

Allows a logged-in user to create a new blog post.

**Request Header**:
- `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "title": "My First Blog",
  "content": "This is the content of my blog."
}
```

**Response**:
- Success (201):
  ```json
  {
    "success": true,
    "message": "Blog created successfully",
    "statusCode": 201,
    "data": {
      "_id": "string",
      "title": "string",
      "content": "string",
      "author": { "details" }
    }
  }
  ```

#### 2.2 Update Blog

`PATCH /api/blogs/:id`

Allows a logged-in user to update their own blog post.

**Request Header**:
- `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "title": "Updated Blog Title",
  "content": "Updated content."
}
```

**Response**:
- Success (200):
  ```json
  {
    "success": true,
    "message": "Blog updated successfully",
    "statusCode": 200,
    "data": {
      "_id": "string",
      "title": "string",
      "content": "string",
      "author": { "details" }
    }
  }
  ```

#### 2.3 Delete Blog

`DELETE /api/blogs/:id`

Allows a logged-in user to delete their own blog post.

**Request Header**:
- `Authorization: Bearer <token>`

**Response**:
- Success (200):
  ```json
  {
    "success": true,
    "message": "Blog deleted successfully",
    "statusCode": 200
  }
  ```

#### 2.4 Get All Blogs (Public)

`GET /api/blogs`

Fetches all blogs with options for searching, sorting, and filtering.

**Query Parameters**:
- `search`: Search blogs by title or content.
- `sortBy`: Sort blogs by fields like `createdAt` or `title`.
- `sortOrder`: Defines sorting order (`asc` or `desc`).
- `filter`: Filter blogs by author ID.

Example Request URL:
```
/api/blogs?search=technology&sortBy=createdAt&sortOrder=desc&filter=60b8f42f9c2a3c9b7cbd4f18
```

**Response**:
- Success (200):
  ```json
  {
    "success": true,
    "message": "Blogs fetched successfully",
    "statusCode": 200,
    "data": [
      {
        "_id": "string",
        "title": "string",
        "content": "string",
        "author": { "details" }
      }
    ]
  }
  ```

### 3. Admin Actions

#### 3.1 Block User

`PATCH /api/admin/users/:userId/block`

Allows an admin to block a user by updating the `isBlocked` property.

**Request Header**:
- `Authorization: Bearer <admin_token>`

**Response**:
- Success (200):
  ```json
  {
    "success": true,
    "message": "User blocked successfully",
    "statusCode": 200
  }
  ```

#### 3.2 Delete Blog

`DELETE /api/admin/blogs/:id`

Allows an admin to delete any blog post.

**Request Header**:
- `Authorization: Bearer <admin_token>`

**Response**:
- Success (200):
  ```json
  {
    "success": true,
    "message": "Blog deleted successfully",
    "statusCode": 200
  }
  ```

## Setup and Installation

### Prerequisites
- Node.js
- MongoDB

### Installation

1. Clone the repository:
   ```bash
   git clone <https://github.com/Saif-Rahman-801/Blog-Application-Server.git>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables in `.env` file:
   - `MONGODB_URI` = MongoDB connection URI
   - `JWT_SECRET` = Secret key for JWT token generation

4. Start the server:
   ```bash
   npm run dev
   ```


