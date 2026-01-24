# Authentication System

## Overview

The application uses Better Auth for authentication, providing a secure and flexible auth system.

## Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant App
    participant BetterAuth
    participant Database

    User->>App: Submit credentials
    App->>BetterAuth: Validate
    BetterAuth->>Database: Check user
    Database-->>BetterAuth: User data
    BetterAuth-->>App: Session token
    App-->>User: Authenticated
```

## Supported Methods

### Email/Password
Traditional email and password authentication with:
- Password hashing (bcrypt)
- Email verification
- Password reset flow

### OAuth Providers
Social login support for:
- Google
- GitHub
- Discord

## Session Management

Sessions are stored in the database with configurable expiration.

```mermaid
stateDiagram-v2
    [*] --> Active: Login
    Active --> Refreshed: Token refresh
    Refreshed --> Active
    Active --> Expired: Timeout
    Active --> Revoked: Logout
    Expired --> [*]
    Revoked --> [*]
```

## Security Considerations

1. **CSRF Protection** - All mutations require valid CSRF tokens
2. **Rate Limiting** - Failed login attempts are rate limited
3. **Secure Cookies** - HttpOnly, Secure, SameSite=Strict
4. **Session Invalidation** - Logout invalidates all sessions
