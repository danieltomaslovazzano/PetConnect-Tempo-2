# PetConnect RESTful API

## Overview

This document describes the RESTful API for the PetConnect application. The API allows for creating, reading, updating, and deleting pet records, with proper authentication and authorization controls.

## Authentication

The API uses JWT (JSON Web Token) authentication. To access protected endpoints, include the JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

### Getting an Authentication Token

To obtain an authentication token, you need to sign in with your credentials:

```bash
# Sign in and get token
curl -X POST "https://your-app-domain.com/api/auth/signin" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "your-password"
  }'
```

Response will include your authentication token:

```json
{
  "user": {
    "id": "user123",
    "email": "user@example.com",
    "name": "John Smith",
    "role": "user"
  },
  "session": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_at": 1687186800000
  },
  "message": "Sign in successful"
}
```

You can also get a token programmatically:

```javascript
async function getAuthToken(email, password) {
  const response = await fetch('https://your-app-domain.com/api/auth/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  return data.session.token;
}
```

For Supabase authentication specifically, you can use the Supabase client:

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://your-project.supabase.co';
const supabaseKey = 'your-anon-key';
const supabase = createClient(supabaseUrl, supabaseKey);

async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) throw error;
  return data.session.access_token;
}
```

## Base URL

All API endpoints are relative to the base URL:

```
https://your-app-domain.com/api
```

## Endpoints

### Pets

#### Get All Pets

```
GET /pets
```

**Query Parameters:**
- `status` - Filter by status (lost, found, resolved, blocked)
- `type` - Filter by pet type (e.g., Dog, Cat)
- `breed` - Filter by breed
- `location` - Filter by location
- `owner_id` - Filter by owner ID
- `reported_after` - Filter by reported date (after)
- `reported_before` - Filter by reported date (before)
- `limit` - Number of results to return (default: 10)
- `offset` - Offset for pagination

**Response:**
```json
{
  "pets": [
    {
      "id": "123",
      "name": "Max",
      "type": "Dog",
      "breed": "Golden Retriever",
      "status": "lost",
      "owner_id": "user123",
      "owner_name": "John Smith",
      "owner_email": "john@example.com",
      "location": "Central Park, New York",
      "coordinates": { "lat": 40.7812, "lng": -73.9665 },
      "reported_date": "2023-06-15T00:00:00.000Z",
      "image_url": "https://example.com/pet-image.jpg"
    }
  ],
  "count": 1,
  "message": "Pets retrieved successfully"
}
```

#### Get Pet by ID

```
GET /pets/:id
```

**Response:**
```json
{
  "pet": {
    "id": "123",
    "name": "Max",
    "type": "Dog",
    "breed": "Golden Retriever",
    "status": "lost",
    "owner_id": "user123",
    "owner_name": "John Smith",
    "owner_email": "john@example.com",
    "location": "Central Park, New York",
    "coordinates": { "lat": 40.7812, "lng": -73.9665 },
    "reported_date": "2023-06-15T00:00:00.000Z",
    "image_url": "https://example.com/pet-image.jpg"
  },
  "message": "Pet retrieved successfully"
}
```

#### Create Pet

```
POST /pets
```

**Authentication Required**

**Request Body:**
```json
{
  "name": "Max",
  "type": "Dog",
  "breed": "Golden Retriever",
  "color": "Golden",
  "gender": "male",
  "size": "large",
  "age": "3 years",
  "description": "Friendly dog with a blue collar",
  "status": "lost",
  "owner_name": "John Smith",
  "owner_email": "john@example.com",
  "location": "Central Park, New York",
  "coordinates": { "lat": 40.7812, "lng": -73.9665 },
  "image_url": "https://example.com/pet-image.jpg",
  "microchipped": true,
  "collar": true,
  "distinctive_features": "White patch on chest"
}
```

**Response:**
```json
{
  "pet": {
    "id": "123",
    "name": "Max",
    "type": "Dog",
    "breed": "Golden Retriever",
    "status": "lost",
    "owner_id": "user123",
    "owner_name": "John Smith",
    "owner_email": "john@example.com",
    "location": "Central Park, New York",
    "coordinates": { "lat": 40.7812, "lng": -73.9665 },
    "reported_date": "2023-06-15T00:00:00.000Z",
    "image_url": "https://example.com/pet-image.jpg"
  },
  "message": "Pet created successfully"
}
```

#### Update Pet

```
PUT /pets/:id
```

**Authentication Required**

**Authorization:** Owner of the pet, moderator, or admin

**Request Body:**
```json
{
  "name": "Max",
  "description": "Updated description",
  "status": "resolved"
}
```

**Response:**
```json
{
  "pet": {
    "id": "123",
    "name": "Max",
    "type": "Dog",
    "breed": "Golden Retriever",
    "status": "resolved",
    "owner_id": "user123",
    "owner_name": "John Smith",
    "owner_email": "john@example.com",
    "location": "Central Park, New York",
    "coordinates": { "lat": 40.7812, "lng": -73.9665 },
    "reported_date": "2023-06-15T00:00:00.000Z",
    "image_url": "https://example.com/pet-image.jpg",
    "description": "Updated description"
  },
  "message": "Pet updated successfully"
}
```

#### Delete Pet

```
DELETE /pets/:id
```

**Authentication Required**

**Authorization:** Owner of the pet or admin

**Response:**
```json
{
  "success": true,
  "message": "Pet deleted successfully"
}
```

#### Block Pet

```
POST /pets/:id/block
```

**Authentication Required**

**Authorization:** Moderator or admin

**Response:**
```json
{
  "pet": {
    "id": "123",
    "name": "Max",
    "type": "Dog",
    "breed": "Golden Retriever",
    "status": "blocked",
    "owner_id": "user123",
    "owner_name": "John Smith",
    "owner_email": "john@example.com",
    "location": "Central Park, New York",
    "coordinates": { "lat": 40.7812, "lng": -73.9665 },
    "reported_date": "2023-06-15T00:00:00.000Z",
    "image_url": "https://example.com/pet-image.jpg"
  },
  "message": "Pet blocked successfully"
}
```

#### Unblock Pet

```
POST /pets/:id/unblock
```

**Authentication Required**

**Authorization:** Moderator or admin

**Request Body:**
```json
{
  "originalStatus": "lost"
}
```

**Response:**
```json
{
  "pet": {
    "id": "123",
    "name": "Max",
    "type": "Dog",
    "breed": "Golden Retriever",
    "status": "lost",
    "owner_id": "user123",
    "owner_name": "John Smith",
    "owner_email": "john@example.com",
    "location": "Central Park, New York",
    "coordinates": { "lat": 40.7812, "lng": -73.9665 },
    "reported_date": "2023-06-15T00:00:00.000Z",
    "image_url": "https://example.com/pet-image.jpg"
  },
  "message": "Pet unblocked successfully"
}
```

## Error Responses

All endpoints return appropriate HTTP status codes:

- `200 OK` - Request succeeded
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request parameters
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `405 Method Not Allowed` - HTTP method not supported
- `500 Internal Server Error` - Server error

Error response format:

```json
{
  "error": "Error message",
  "details": {}
}
```

## Rate Limiting

API requests are limited to 100 requests per minute per IP address. Exceeding this limit will result in a `429 Too Many Requests` response.

## CORS

The API supports Cross-Origin Resource Sharing (CORS) for integration with third-party applications.

## API Versioning

API versioning is handled through the URL path. The current version is v1:

```
/api/v1/pets
```

Future versions will use a different version number:

```
/api/v2/pets
```

## Integration Examples

### cURL Examples

```bash
# Get all lost pets
curl -X GET "https://your-app-domain.com/api/pets?status=lost" \
  -H "Accept: application/json"

# Get a specific pet by ID
curl -X GET "https://your-app-domain.com/api/pets/123" \
  -H "Accept: application/json"

# Create a new pet (authenticated)
curl -X POST "https://your-app-domain.com/api/pets" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "name": "Max",
    "type": "Dog",
    "breed": "Golden Retriever",
    "color": "Golden",
    "gender": "male",
    "size": "large",
    "status": "lost",
    "owner_name": "John Smith",
    "owner_email": "john@example.com",
    "location": "Central Park, New York",
    "coordinates": { "lat": 40.7812, "lng": -73.9665 },
    "image_url": "https://example.com/pet-image.jpg"
  }'

# Update a pet (authenticated)
curl -X PUT "https://your-app-domain.com/api/pets/123" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "description": "Updated description",
    "status": "resolved"
  }'

# Delete a pet (authenticated)
curl -X DELETE "https://your-app-domain.com/api/pets/123" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"

# Block a pet (moderator/admin only)
curl -X POST "https://your-app-domain.com/api/pets/123/block" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"

# Unblock a pet (moderator/admin only)
curl -X POST "https://your-app-domain.com/api/pets/123/unblock" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "originalStatus": "lost"
  }'
```

### JavaScript/TypeScript

```typescript
// Get all lost pets
async function getLostPets() {
  const response = await fetch('https://your-app-domain.com/api/pets?status=lost');
  const data = await response.json();
  return data.pets;
}

// Create a new pet report (authenticated)
async function reportLostPet(petData, token) {
  const response = await fetch('https://your-app-domain.com/api/pets', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(petData)
  });
  
  const data = await response.json();
  return data.pet;
}
```

### Python

```python
import requests

# Get all lost pets
def get_lost_pets():
    response = requests.get('https://your-app-domain.com/api/pets', params={'status': 'lost'})
    data = response.json()
    return data['pets']

# Create a new pet report (authenticated)
def report_lost_pet(pet_data, token):
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {token}'
    }
    response = requests.post('https://your-app-domain.com/api/pets', json=pet_data, headers=headers)
    data = response.json()
    return data['pet']
```

## Webhook Integration

Third-party applications can subscribe to webhook events for real-time updates:

1. Register a webhook URL at `/api/webhooks/register`
2. Receive events for pet creation, updates, and matches

Example webhook payload:

```json
{
  "event": "pet.created",
  "timestamp": "2023-06-15T12:00:00.000Z",
  "data": {
    "pet": {
      "id": "123",
      "name": "Max",
      "type": "Dog",
      "status": "lost"
    }
  }
}
```
