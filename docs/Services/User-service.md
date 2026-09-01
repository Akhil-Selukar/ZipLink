<h3 align="center"> User service </h3><hr>

User service handles user management i.e. creation of new use and all other user related operations if in future required.

### API's

1. API to create new user (i.e. sign-up functionality)<br>
   HTTP method: POST<br>
   api endpoint: /user/create<br>
   request parameter:<br>
   Content-Type: application/json
   ```json
   {
     "userName": "John",
     "emailId": "john@example.com",
     "password": "password123"
   }
   ```
   response: 200:OK with message "User John Doe created successfully"

This service save data in two tables `Users` and `user_login`. Users table is basically the table which store all information about user. Any user profile edit operation or if we want to fetch user profile then that information we can get from this table. While user_login table is specifically for authetication purpose, hence only user email and encoded password is stored in this table. The authentication service will use this table to validate user credentials.

Environment variables for this service:<br>

```
SPRING_PROFILES_ACTIVE=dev
LOG_LEVEL=INFO
DB_URL=jdbc:mysql://localhost:3306/ziplink_dev
DB_USERNAME=
DB_PASSWORD=
SERVER_PORT=8081
```

> default port for this service is 8080 and default log level is also set to INFO.
