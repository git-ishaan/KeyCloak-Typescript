# 🔐 Full Stack Keycloak Authentication Demo

A comprehensive demonstration of secure authentication and authorization using Keycloak in a modern full-stack application. This project showcases role-based access control (RBAC) with a React frontend and Fastify backend, implementing real-world authentication patterns.

## 🏗️ System Architecture

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   React App     │         │    Keycloak     │         │     Fastify     │
│   (Frontend)    │         │     Server      │         │    Backend      │
│                 │         │                 │         │                 │
│  ┌─────────┐    │    1    │  ┌─────────┐   │    3    │  ┌─────────┐   │
│  │   UI    │────┼────────►│  │  Auth   │   │         │  │  APIs   │   │
│  └─────────┘    │         │  │ Server  │   │         │  └─────────┘   │
│       ▲         │         │  └─────────┘   │         │       ▲        │
│       │         │    2    │       │        │         │       │        │
│  ┌─────────┐    │◄────────┤  ┌─────────┐  │    4    │       │        │
│  │  Token  │    │         │  │  Token  │──┼────────►│       │        │
│  │ Storage │    │         │  │ Issuer  │  │         │       │        │
│  └─────────┘    │         │  └─────────┘  │         │       │        │
│       │         │         │               │         │       │        │
└───────┼─────────┘         └───────────────┘         └───────┼────────┘
        │                                                     │
        └─────────────────────────  5  ───────────────────────┘

Flow:
1. User authentication request
2. JWT token issuance
3. Token verification request
4. Token validation
5. Protected API access with verified token
```

## 🌟 Key Features

- **Secure Authentication**: Complete Keycloak integration for robust user authentication
- **Role-Based Access Control**: Granular access management with admin and user roles
- **Protected API Endpoints**: Secure backend routes with role-based authorization
- **JWT Token Management**: Secure token handling and validation
- **Modern UI**: Responsive interface with role-based component rendering

## 🔄 Authentication Flow Explained

### 1. Initial Authentication
1. User accesses the React application
2. Application redirects to Keycloak login
3. User provides credentials
4. Keycloak validates credentials and issues JWT
5. Application stores token securely

### 2. Protected Resource Access
1. Frontend includes JWT in API requests
2. Backend validates token signature
3. Backend checks user roles
4. Access granted based on user permissions

### 3. Role-Based Authorization
- **Admin Users** (user1, user2):
  - Complete system access
  - All API endpoints available
  - Full UI component visibility

- **Regular Users** (user3, user4):
  - Limited system access
  - Restricted API endpoints
  - Partial UI component visibility

## 🚀 Quick Start Guide

### Prerequisites
- Node.js v14+
- Docker
- npm/yarn

### 1. Keycloak Setup
```bash
# Start Keycloak server
docker run -p 8001:8080 \
  -e KEYCLOAK_ADMIN=admin \
  -e KEYCLOAK_ADMIN_PASSWORD=admin \
  quay.io/keycloak/keycloak:latest start-dev
```

### 2. Keycloak Configuration

1. **Access Admin Console**
   - URL: `http://localhost:8001`
   - Credentials: admin/admin

2. **Create New Realm**
   - Name: `test101`
   - Enable realm

3. **Configure Client**
   - Client ID: `react-app`
   - Client Protocol: `openid-connect`
   - Root URL: `http://localhost:5173`
   - Valid Redirect URIs: `http://localhost:5173/*`
   - Web Origins: `+`

4. **Set Up Users**
   ```
   Admin Access:
   - Username: user1, Password: user1, Role: admin
   - Username: user2, Password: user2, Role: admin

   Standard Access:
   - Username: user3, Password: user3, Role: user
   - Username: user4, Password: user4, Role: user
   ```

### 3. Application Setup

```bash
# Backend Setup
cd backend
npm install
npm run dev

# Frontend Setup
cd frontend
npm install
npm run dev
```

## 🎯 Access Control Matrix

| Resource    | Description          | Admin Access | User Access |
|-------------|---------------------|--------------|-------------|
| Card One    | Admin Dashboard     | ✅           | ❌          |
| Card Two    | Analytics Panel     | ✅           | ❌          |
| Card Three  | User Dashboard      | ✅           | ✅          |
| Card Four   | General Content     | ✅           | ✅          |

## 🛠️ Technical Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Keycloak-js for authentication
- Framer Motion for animations

### Backend
- Fastify server
- TypeScript
- JWT token validation
- Role-based middleware

### Authentication
- Keycloak Server
- JWT token management
- RBAC implementation

## 🧪 Testing the Application

### Admin Testing (user1/user2)
1. Login with admin credentials
2. Verify access to all cards
3. Test all API endpoints
4. Confirm full system access

### User Testing (user3/user4)
1. Login with user credentials
2. Verify limited card access
3. Test permitted endpoints
4. Confirm access restrictions

## 🔍 Security Considerations

- JWT tokens are validated on every request
- Role verification occurs server-side
- Secure token storage implementation
- Protected API endpoints
- CORS configuration
- Secure logout handling

## 🤝 Contributing

We welcome contributions! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👏 Acknowledgments

- Keycloak Community
- Fastify Framework Team
- React Development Team
- Open Source Community

## 📮 Support

For support, please open an issue in the GitHub repository or contact the maintainers.
