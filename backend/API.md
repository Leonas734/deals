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

### Update user password

> /api/user/update_password/ **POST**

Required fields: {'Bearer jwt-token', 'password', 'new_password', 'new_password_repeat'}

Optional fields: **None**

Permissions: **Authenticed**

Returns = {'detail' : 'Password updated successfully.'}, status_code = 200

### Get all deals

> /api/user/deal/ **GET**

### Create new deal

> /api/user/deal/ **POST**

Required fields: {'Bearer jwt-token', 'title', 'description', 'category'}

Optional fields: {
'image', 'price', 'url', 'instore_only', 'postage_cost',
'sent_from', 'deal_start_date', 'deal_end_date',
}

Permissions: **Authenticed, verified email**

Returns = {all details}, status_code = 200

### Update deal

> /api/user/deal/deal_id **POST**

Required fields: **None**

Optional fields: {
'title', 'description', 'category','image', 'price', 'url', 'instore_only',
'postage_cost', 'sent_from', 'deal_start_date', 'deal_end_date',
}

Permissions: **Authenticed, verified email, is owner of object**

Returns = {all details}, status_code = 201

### Delete deal

> /api/user/deal/deal_id **DELETE**

Required fields: **None**

Optional fields: **None**

Permissions: **Authenticed, verified email, is owner of object**

Returns = {}, status_code = 204

### Vote on deal

> /api/user/deal/deal_id/vote **POST**

Required fields: **None**

Optional fields: {'vote': True, False or ''}

Permissions: **Authenticed, verified email**

Returns = {'detail': 'Vote accepted.'}, status_code = 200
