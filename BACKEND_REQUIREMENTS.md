# Backend Requirements for Local Express Server

This frontend is now configured to connect to your local Express.js/MongoDB/Socket.IO backend.

## Required Backend Endpoints

### Authentication API (REST)

**POST** `/api/auth/signup`
```json
Request:
{
  "email": "user@example.com",
  "password": "password123",
  "displayName": "John Doe"
}

Response:
{
  "user": {
    "_id": "userId",
    "email": "user@example.com",
    "displayName": "John Doe"
  },
  "token": "jwt-token-here"
}
```

**POST** `/api/auth/login`
```json
Request:
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "user": {
    "_id": "userId",
    "email": "user@example.com",
    "displayName": "John Doe"
  },
  "token": "jwt-token-here"
}
```

### Messages API (REST)

**GET** `/api/messages`
- Headers: `Authorization: Bearer <token>`
- Returns array of all messages

## Socket.IO Events

### Client → Server Events

**Connection**
```javascript
socket.on('connection', (socket) => {
  // Verify token from socket.handshake.auth.token
});
```

**sendMessage**
```json
{
  "text": "Hello world",
  "userId": "userId",
  "userName": "John Doe"
}
```

### Server → Client Events

**previousMessages** (on connection)
```json
[
  {
    "_id": "messageId",
    "text": "Hello",
    "userId": "userId",
    "userName": "John Doe",
    "timestamp": "2024-01-01T12:00:00.000Z"
  }
]
```

**newMessage** (broadcast to all clients)
```json
{
  "_id": "messageId",
  "text": "New message",
  "userId": "userId",
  "userName": "John Doe",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**error**
```json
"Error message string"
```

## MongoDB Schema Examples

### User Model
```javascript
{
  email: String (unique, required),
  password: String (hashed, required),
  displayName: String (required),
  createdAt: Date
}
```

### Message Model
```javascript
{
  text: String (required),
  userId: ObjectId (ref: 'User'),
  userName: String (required),
  timestamp: Date (default: Date.now)
}
```

## Configuration

Update `src/config/api.ts` with your backend URL:
```typescript
export const API_URL = 'http://localhost:5000';
export const SOCKET_URL = 'http://localhost:5000';
```

## CORS Setup

Your Express server must enable CORS:
```javascript
app.use(cors({
  origin: 'http://localhost:8080', // Lovable dev server
  credentials: true
}));
```

## Socket.IO Server Setup

```javascript
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:8080',
    credentials: true
  }
});
```
