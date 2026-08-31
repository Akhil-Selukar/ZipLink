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
