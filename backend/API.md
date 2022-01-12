# USER

### Create User

> /api/sign_up/ **POST**

Required fields: {'username', 'email', 'password', 'repeat_password'}

Optional fields: **None**

Permissions: **None**

Returns = {'username' : 'submitted-username'}, status_code = 201

### Log in

> /api/log_in/ **POST**

Required fields: {'username', 'password'}

Optional fields: **None**

Permissions: **None**

Returns = {'access' : 'jwt-token', 'refresh' : 'jwt-token'}, status_code = 200

### Verify email

> /api/email_verification/{string:user_id}/{string:email_verification_token}/ **POST**

Required fields: **None**

Optional fields: **None**

Permissions: **None**

Returns = {'detail' : 'Email verified.'}, status_code = 200

### Request new email verification email

> /api/email_verification/new_token/ **GET**

Required fields: 'Bearer {jwt-token}'

Optional fields: **None**

Permissions: **Authenticed**

Returns = {'detail' : 'Email verification sent. Please check your inbox.'}, status_code = 200

### Update user email

> /api/user/update_email/ **POST**

Required fields: {'Bearer jwt-token', 'password', 'email'}

Optional fields: **None**

Permissions: **Authenticed**

Returns = {'detail' : 'Email updated successfully.'}, status_code = 200

### Update user profile picture

> /api/user/update_profile_picture/ **POST**

Required fields: {'Bearer jwt-token', 'password', 'profile_picture'}

Optional fields: **None**

Permissions: **Authenticed**

Returns = {'detail' : 'Profile picture updated successfully.'}, status_code = 200
