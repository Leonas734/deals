# USER

### Create User

> /api/sign_up/ **POST**

Required fields = {'username', 'email', 'password', 'repeat_password'}

Optional fields: **None**

Permissions: **None**

Returns = {'username' : 'submitted-username'}, status_code = 201

> /api/log_in/ **POST**

Required fields = {'username', 'password'}

Optional fields: **None**

Permissions: **None**

Returns = {'access' : 'jwt-token', 'refresh' : 'jwt-token'}, status_code = 200

> /api/user/{user_id}/verify_email/{email_verification_token}/ **POST**

Required fields = **None**

Optional fields: **None**

Permissions: **None**

Returns = {'message' : 'Email verified.'}, status_code = 200

> /api/user/verify_email/new_token/ **GET**

Required fields = **Authorization - 'Bearer {jwt-token}'**

Optional fields: **None**

Permissions: **Authenticed**

Returns = {'message' : 'Email verification sent. Please check your inbox.'}, status_code = 200
