# User API methods

|      USAGE      |      URL      | METHOD | AUTH? | VERIFIED EMAIL? |
| :-------------: | :-----------: | :----: | :---: | :-------------: |
| Create new user | /api/sign_up/ |  POST  |  No   |       No        |

**Required fields:** `{'username', 'email', 'password', 'password_repeat'}`

**Returns:** `{'username' : <submitted-username>}, status_code = 201`

---

|    USAGE    |     URL      | METHOD | AUTH? | VERIFIED EMAIL? |
| :---------: | :----------: | :----: | :---: | :-------------: |
| Log in user | /api/log_in/ |  POST  |  No   |       No        |

**Required fields:** `{'username', 'password'}`

username field can be email address or username⚠️

**Returns:** `{'refresh' : <jwt-token>, 'access': <jwt-token>}, status_code = 200`

---

|    USAGE     |                      URL                      | METHOD | AUTH? | VERIFIED EMAIL? |
| :----------: | :-------------------------------------------: | :----: | :---: | :-------------: |
| Verify email | /api/email_verification/<user.id>/<token.id>/ |  POST  |  No   |       No        |

**Required fields:** `None`

**Returns:** `{'detail': 'Email successfully verified.'}, status_code = 200`

---

|                USAGE                 |                URL                 | METHOD | AUTH? | VERIFIED EMAIL? |
| :----------------------------------: | :--------------------------------: | :----: | :---: | :-------------: |
| Request new email verification email | /api/email_verification/new_token/ |  GET   |  Yes  |       No        |

**Required fields:** `None`

**Returns:** `{'detail': 'Email verification sent. Please check your inbox.'}, status_code = 200`

---

|           USAGE           |           URL           | METHOD | AUTH? | VERIFIED EMAIL? |
| :-----------------------: | :---------------------: | :----: | :---: | :-------------: |
| Update user email address | /api/user/update_email/ |  POST  |  Yes  |       No        |

**Required fields:** `{'password', 'email'}`

Email verification automatically sent to new email address⚠️

**Returns:** `{'detail': 'Email updated successfully.'}, status_code = 200`

---

|            USAGE            |                URL                | METHOD | AUTH? | VERIFIED EMAIL? |
| :-------------------------: | :-------------------------------: | :----: | :---: | :-------------: |
| Update user profile picture | /api/user/update_profile_picture/ |  POST  |  Yes  |       No        |

**Required fields:** `{'password', 'profile_picture'}`

**Returns:** `{'detail': 'Profile picture updated successfully.'}, status_code = 200`

---

|        USAGE         |            URL             | METHOD | AUTH? | VERIFIED EMAIL? |
| :------------------: | :------------------------: | :----: | :---: | :-------------: |
| Update user password | /api/user/update_password/ |  POST  |  Yes  |       No        |

**Required fields:** `{'password', 'new_password', 'new_password_repeat'}`

User requested to relog once jwt-access token expires. Expire time inside settings.py file⚠️

**Returns:** `{'detail': 'Password updated successfully.'}, status_code = 200`

# Deal API methods

|     USAGE     |    URL     | METHOD | AUTH? | VERIFIED EMAIL? |
| :-----------: | :--------: | :----: | :---: | :-------------: |
| Get all deals | /api/deal/ |  GET   |  No   |       No        |

**Required fields:** `None`

**Returns:** `Array with all deals, status_code = 200`

---

|      USAGE      |    URL     | METHOD | AUTH? | VERIFIED EMAIL? |
| :-------------: | :--------: | :----: | :---: | :-------------: |
| Create new deal | /api/deal/ |  POST  |  Yes  |       Yes       |

**Required fields:** `{'title', 'description', 'category'}`

Category & sent_from must match one of the choice_fields from Deal model inside models.py⚠️

**Optional fields:** `{'image', 'price', 'url', 'instore_only', 'postage_cost', 'sent_from', 'deal_start_date', 'deal_end_date'}`

If instore_only: True, postage_cost and sent_from must be excluded. Vice versa, exclude instore_only if including postage details⚠️

**Returns:** `{'id', 'rating', 'user': {'username', 'profile_picture}, 'rated_by_user', 'title', 'description', 'image', 'price', 'url', 'category', 'instore_only', 'postage_cost', 'sent_from', 'deal_start_date', 'deal_end_date', 'created', 'updated'}, status_code = 201`

rated_by_user = Checks if current user has voted on this deal. True=Up vote, False=Down vote, None=No vote. ⚠️

---

|        USAGE        |         URL         | METHOD | AUTH? | VERIFIED EMAIL? |
| :-----------------: | :-----------------: | :----: | :---: | :-------------: |
| Update deal details | /api/deal/<deal_id> | PATCH  |  Yes  |       Yes       |

**Optional fields:** `{'title', 'description', 'category','image', 'price', 'url', 'instore_only','postage_cost', 'sent_from', 'deal_start_date', 'deal_end_date',}`

**Returns:** `{Standard deal view. Check create new deal API method for more info.}, status_code = 200`

User must be owner of Deal object to be able to modify it. ⚠️

---

|    USAGE    |         URL         | METHOD | AUTH? | VERIFIED EMAIL? |
| :---------: | :-----------------: | :----: | :---: | :-------------: |
| Delete deal | /api/deal/<deal_id> | DELETE |  Yes  |       Yes       |

User must be owner of Deal object to be able to delete it. ⚠️

**Returns:** `status_code = 204`

---

|    USAGE     |            URL            | METHOD | AUTH? | VERIFIED EMAIL? |
| :----------: | :-----------------------: | :----: | :---: | :-------------: |
| Vote on deal | /api/deal/<deal_id>/vote/ |  POST  |  Yes  |       Yes       |

**Required fields:** `{'vote': True/False/None}`

True = Up vote, False = Down vote, None = Neutral. ⚠️

**Returns:** `{'detail': 'Vote accepted.'}, status_code = 200`

# Comment API methods

|        USAGE         |        URL         | METHOD | AUTH? | VERIFIED EMAIL? |
| :------------------: | :----------------: | :----: | :---: | :-------------: |
| Post comment on deal | /api/deal_comment/ |  POST  |  Yes  |       Yes       |

**Required fields:** `{'deal', 'text'}`

**Returns:** `{'id', 'deal', 'created', 'user': {'username', 'profile_picture'}, 'text', 'quoted_comment', 'liked_by_user', 'total_likes'}, status_code = 201`

---

|         USAGE         |              URL              | METHOD | AUTH? | VERIFIED EMAIL? |
| :-------------------: | :---------------------------: | :----: | :---: | :-------------: |
| Get all deal comments | /api/deal/{deal_id}/comments/ |  GET   |  No   |       No        |

**Returns:** `{Returns array of deal comments. Check "post comment on deal" method for more details}, status_code = 201`

---

|       USAGE       |                URL                | METHOD | AUTH? | VERIFIED EMAIL? |
| :---------------: | :-------------------------------: | :----: | :---: | :-------------: |
| Like deal comment | /api/deal_comment/{deal_id}/like/ |  POST  |  Yes  |       Yes       |

Each time url is hit with post request, it will either unlike or like, depending on previous state ⚠️

## **Returns:** `{'id', 'deal', 'created', 'user': {'username', 'profile_picture'}, 'text', 'quoted_comment', 'liked_by_user','total_likes'}, status_code = 200`

---

|           USAGE           |              URL               | METHOD | AUTH? | VERIFIED EMAIL? |
| :-----------------------: | :----------------------------: | :----: | :---: | :-------------: |
| Get all deals by category | /api/deal/<category>/cateogry/ |  GET   |  No   |       No        |

Category field must be a valid. Check choice_fields inside models.py Deal model for more detail. ⚠️

**Returns:** `Array with all deals filtered by category, status_code = 200`
