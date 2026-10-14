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

### Implementation note

The intended request shape and response are documented above, but the current route/controller/service contain mismatched field and method names. In particular, the controller refers to `fullname` inconsistently and calls `hashedPassword`, while the model defines `hashPassword`; the service also passes a nested `fullname` object although the model stores `firstname` and `lastname` as top-level fields. As a result, a valid request may currently fail before registration completes.
