# Role-Based Authentication System

A robust authentication and authorization system implementing role-based access control (RBAC) for secure user management.

Live demo link: [Click here](https://note-app-p8s8.onrender.com/)

## Features

- User authentication (login/registration)
- Role-based access control (RBAC)
- JWT token-based authentication
- Password hashing and security
- Protected routes and middleware
- User role management

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: bcrypt

## Installation

1. Clone the repository:

```bash
git clone https://github.com/simha-sage/Note-App.git
cd roleBasedAuthDec12
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory:

```env
PORT=3000
DATABASE_URL=your_database_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRE=24h
```

4. Start the application:

```bash
npm start
```

For development:

```bash
npm run dev
```

## API Endpoints

### Authentication

- `POST /auth/signup` - Register a new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user

### Users (Protected)

- `GET /auth/getAllNotes` - Get all users (Admin only)
- `GET /auth/getNotes` - Get user by ID
- `POST /auth/notes` - Update user
- `DELETE /api/users/:id` - Delete user (Admin only)

## User Roles

- **Admin**: Full access to all resources
- **User**: Limited access to own resources

## Usage Example

```javascript
// Register a new user
POST /api/auth/register
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "user"
}

// Login
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

## Project Structure

```
roleBasedAuthDec12/
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── utils/
├── .env
├── package.json
└── README.md
```

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based authorization
- Protected routes
- Environment variable configuration

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Contact

Lakshmi Narasimha - [@lnarsimha](https://www.linkedin.com/in/lnarsimha/)

Project Link: [https://github.com/simha-sage/Note-App](https://github.com/simha-sage/Note-App)

```

```
