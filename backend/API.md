# USER

### Create User

> /api/user/ **POST**

Required fields = {'username', 'email', 'password', 'repeat_password'}

Optional fields: **None**

Permissions: **None**

Returns = {'username' : 'submitted-username'}, status_code = 201

> /api/user/{user_id}/verify_email/{email_verification_token}/ **POST**

Required fields = **None**

Optional fields: **None**

Permissions: **None**

Returns = {'message' : 'Email verified.'}, status_code = 200
