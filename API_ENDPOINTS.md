# API Endpoints Documentation

## Authentication Endpoints

### Register
- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Description**: Register a new user (candidate or employer)
- **Request Body**:
```json
{
  "email": "string",
  "password": "string",
  "role": "CANDIDATE" | "EMPLOYER",
  "firstName": "string",
  "lastName": "string",
  // For candidates only
  "skills": ["string"],
  "experience": "string",
  "bio": "string",
  "portfolio": "string",
  "location": "string",
  "yearsOfExperience": number,
  "availability": "Immediate" | "2 Weeks" | "1 Month" | "3 Months",
  "hourlyRate": number,
  "education": "string",
  "certifications": ["string"],
  "languages": ["string"],
  "preferredWorkType": "Remote" | "Hybrid" | "On-site",
  "photo": "string" // Base64 encoded image
}
```
- **Response**: 
```json
{
  "id": "string",
  "email": "string",
  "role": "CANDIDATE" | "EMPLOYER",
  "firstName": "string",
  "lastName": "string",
  // ... other user fields
}
```

### Login
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Description**: Authenticate user and return JWT token
- **Request Body**:
```json
{
  "email": "string",
  "password": "string"
}
```
- **Response**:
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "email": "string",
    "role": "CANDIDATE" | "EMPLOYER",
    "firstName": "string",
    "lastName": "string"
  }
}
```

## Candidate Endpoints

### Get All Candidates
- **URL**: `/api/candidates`
- **Method**: `GET`
- **Description**: Get all candidates with optional filtering and sorting
- **Query Parameters**:
  - `search`: string (optional) - Search by name, skills, or location
  - `skills`: string[] (optional) - Filter by skills
  - `minExperience`: number (optional) - Minimum years of experience
  - `maxRate`: number (optional) - Maximum hourly rate
  - `availability`: string (optional) - Filter by availability
  - `sortBy`: "name" | "experience" | "rate" | "availability" (optional)
- **Response**:
```json
{
  "candidates": [
    {
      "id": "string",
      "firstName": "string",
      "lastName": "string",
      "photo": "string",
      "photoSize": number,
      "photoDimensions": {
        "width": number,
        "height": number
      },
      "skills": ["string"],
      "experience": "string",
      "bio": "string",
      "portfolio": "string",
      "location": "string",
      "yearsOfExperience": number,
      "availability": "string",
      "hourlyRate": number,
      "education": "string",
      "certifications": ["string"],
      "languages": ["string"],
      "preferredWorkType": "string"
    }
  ]
}
```

### Get Candidate by ID
- **URL**: `/api/candidates/{id}`
- **Method**: `GET`
- **Description**: Get detailed information about a specific candidate
- **Response**: Same as single candidate object in the list response

### Update Candidate Profile
- **URL**: `/api/candidates/{id}`
- **Method**: `PUT`
- **Description**: Update candidate profile information
- **Request Body**: Same as register candidate body
- **Response**: Updated candidate object

## Interview Request Endpoints

### Send Interview Request
- **URL**: `/api/interview-requests`
- **Method**: `POST`
- **Description**: Send an interview request to a candidate
- **Request Body**:
```json
{
  "candidateId": "string",
  "message": "string",
  "proposedDate": "string", // ISO date string
  "proposedRate": number
}
```
- **Response**:
```json
{
  "id": "string",
  "candidateId": "string",
  "employerId": "string",
  "message": "string",
  "proposedDate": "string",
  "proposedRate": number,
  "status": "PENDING" | "ACCEPTED" | "REJECTED",
  "createdAt": "string"
}
```

### Get Interview Requests
- **URL**: `/api/interview-requests`
- **Method**: `GET`
- **Description**: Get all interview requests for the authenticated user
- **Query Parameters**:
  - `status`: "PENDING" | "ACCEPTED" | "REJECTED" (optional)
- **Response**:
```json
{
  "requests": [
    {
      "id": "string",
      "candidateId": "string",
      "employerId": "string",
      "message": "string",
      "proposedDate": "string",
      "proposedRate": number,
      "status": "string",
      "createdAt": "string",
      "candidate": {
        "firstName": "string",
        "lastName": "string",
        "photo": "string"
      }
    }
  ]
}
```

### Update Interview Request Status
- **URL**: `/api/interview-requests/{id}`
- **Method**: `PATCH`
- **Description**: Update the status of an interview request
- **Request Body**:
```json
{
  "status": "ACCEPTED" | "REJECTED"
}
```
- **Response**: Updated interview request object

## Photo Upload Endpoints

### Upload Photo
- **URL**: `/api/photos/upload`
- **Method**: `POST`
- **Description**: Upload a profile photo
- **Request Body**: Form data with file field
- **Response**:
```json
{
  "url": "string",
  "size": number,
  "dimensions": {
    "width": number,
    "height": number
  }
}
```

## Error Responses
All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "string",
  "message": "string"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Invalid or missing authentication token"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "You don't have permission to perform this action"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "The requested resource was not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
``` 