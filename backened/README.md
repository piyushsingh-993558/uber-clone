# Backend API

## Register a user 
 
Creates a user account and returns an authentication token.

### Endpoint

```http
POST /users/register
Content-Type: application/json
```

The `/users` prefix is mounted in `app.js`, and the `/register` path is defined in `routes/user.routes.js`.

### Request body

Send a JSON object with the following fields:

| Field | Required | Requirements |
| --- | --- | --- |
| `fullname.firstname` | Yes | At least 3 characters |
| `lastname` | No | If supplied, at least 3 characters according to the user model |
| `email` | Yes | Must be a valid email address |
| `password` | Yes | At least 6 characters |

Example:

```json
{
  "fullname": {
    "firstname": "Alex"
  },
  "lastname": "Morgan",
  "email": "alex@example.com",
  "password": "secret123"
}
```

### Responses

#### `201 Created`

Registration succeeded. The response is intended to contain a token and the created user:

```json
{
  "token": "<jwt-token>",
  "user": {
    "_id": "<user-id>",
    "firstname": "Alex",
    "lastname": "Morgan",
    "email": "alex@example.com"
  }
}
```

The token is configured to expire after 24 hours. The user model excludes the password from query results by default.

#### `400 Bad Request`

One or more request fields failed validation. The response contains the validation errors:

```json
{
  "errors": [
    {
      "msg": "Invalid Email",
      "path": "email"
    }
  ]
}
```

#### `500 Internal Server Error`

An unexpected server-side error occurred, such as a database or registration-processing error.

## Log in a user

Authenticates an existing user with an email address and password and returns an authentication token.

### Endpoint

```http
POST /users/login
Content-Type: application/json
```

The `/users` prefix is mounted in `app.js`, and the `/login` path is defined in `routes/user.routes.js`.

### Request body

| Field | Required | Requirements |
| --- | --- | --- |
| `email` | Yes | Must be a valid email address |
| `password` | Yes | At least 6 characters |

Example:

```json
{
  "email": "alex@example.com",
  "password": "secret123"
}
```

Example request with `curl`:

```sh
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alex@example.com","password":"secret123"}'
```

### Responses

#### `200 OK`

The credentials were accepted. The token is a JWT configured to expire after 24 hours.

```json
{
  "token": "<jwt-token>",
  "user": {
    "_id": "<user-id>",
    "firstname": "Alex",
    "lastname": "Morgan",
    "email": "alex@example.com"
  }
}
```

The password is not part of the intended response. The current controller explicitly selects the stored password hash to compare credentials, so it should remove that field before returning the user.

#### `400 Bad Request`

The request fields failed validation. The response contains the validation errors:

```json
{
  "errors": [
    {
      "msg": "Invalid Email",
      "path": "email"
    }
  ]
}
```

#### `401 Unauthorized`

The email address was not found or the password did not match. Both cases return the same response to avoid revealing which credential was incorrect:

```json
{
  "message": "Invalid email or password"
}
```

#### `500 Internal Server Error`

An unexpected server-side error occurred, such as a database or authentication-processing error.

### Implementation note

This describes the intended endpoint contract. The current route has a typo in the email validator (`isEmaail`), and initializes the router with `express.router()` instead of `express.Router()`. These prevent the route module from loading/registering correctly. Fix those issues before relying on the endpoint. Also, the controller selects `+password` for comparison and currently returns that selected user object; exclude the password field from the response before exposing the endpoint.

### Implementation note

The intended request shape and response are documented above, but the current route/controller/service contain mismatched field and method names. In particular, the controller refers to `fullname` inconsistently and calls `hashedPassword`, while the model defines `hashPassword`; the service also passes a nested `fullname` object although the model stores `firstname` and `lastname` as top-level fields. As a result, a valid request may currently fail before registration completes.

## Get the current user's profile

Returns the authenticated user's profile. The endpoint requires a valid JWT either in the `token` cookie or as a Bearer token in the `Authorization` header.

### Endpoint

```http
GET /users/profile
```

Bearer token example:

```http
Authorization: Bearer <jwt-token>
```

Example request with `curl`:

```sh
curl http://localhost:3000/users/profile \
  -H "Authorization: Bearer <jwt-token>"
```

### Responses

#### `200 OK`

The authenticated user's document is returned. The password is excluded by default by the user model.

```json
{
  "_id": "<user-id>",
  "firstname": "Alex",
  "lastname": "Morgan",
  "email": "alex@example.com"
}
```

#### `401 Unauthorized`

The token is missing, invalid, expired, or has been blacklisted:

```json
{
  "message": "Unauthorized"
}
```

## Log out a user

Invalidates the current JWT by adding it to the token blacklist and clears the `token` cookie. A blacklisted token is retained until its 24-hour TTL expires.

### Endpoint

```http
GET /users/logout
```

Send the token using the `token` cookie or as a Bearer token in the `Authorization` header.

Example request with `curl`:

```sh
curl -X GET http://localhost:3000/users/logout \
  -H "Authorization: Bearer <jwt-token>" \
  --cookie "token=<jwt-token>"
```

### Responses

#### `200 OK`

```json
{
  "message": "Logged out"
}
```

#### `401 Unauthorized`

The token is missing, invalid, expired, or already blacklisted:

```json
{
  "message": "Unauthorized"
}
```

### Implementation note

These describe the intended endpoint behavior. The current route module and authentication middleware contain errors that prevent these endpoints from working as documented: the router uses `express.router()` instead of `express.Router()`, the middleware import has a misspelled `require` and points to `middlewares` rather than the existing `middleware` directory, and the middleware has invalid blacklist lookup and JWT verification expressions. Cookie-based authentication also requires `cookie-parser` to be registered before the routes.
