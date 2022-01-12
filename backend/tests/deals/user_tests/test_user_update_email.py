import pytest

from tests.deals.testing_fixtures import test_user_1, test_user_1_access_token, api_client
from tests.deals.testing_variables import TEST_USER_1_PASSWORD

@pytest.mark.django_db
def test_update_email_field(test_user_1, api_client, test_user_1_access_token, mailoutbox):    
    new_email = 'new-email@email.com'
    api_client.credentials(HTTP_AUTHORIZATION='Bearer ' + test_user_1_access_token)
    resp = api_client.post(
        '/api/user/update_email/',
        data={
            'password': TEST_USER_1_PASSWORD,
            'email': new_email,
        }
    )

    test_user_1.refresh_from_db()
    assert resp.status_code == 200
    assert len(resp.data) == 1
    assert resp.data['detail'] == 'Email updated successfully.'
    assert test_user_1.email == new_email

@pytest.mark.django_db
def test_verified_user_update_email(test_user_1, api_client, test_user_1_access_token):    
    test_user_1.email_verified = True
    test_user_1.email_verification_token_date = None
    test_user_1.save()

    assert test_user_1.email_verified == True
    assert test_user_1.email_verification_token_date == None

    new_email = 'new-email@email.com'
    api_client.credentials(HTTP_AUTHORIZATION='Bearer ' + test_user_1_access_token)
    resp = api_client.post(
        '/api/user/update_email/',
        data={
            'password': TEST_USER_1_PASSWORD,
            'email': new_email,
        }
    )
    assert resp.status_code == 200
    test_user_1.refresh_from_db()
    assert test_user_1.email_verified == False
    assert test_user_1.email_verification_token_date != None

@pytest.mark.django_db
def test_user_update_email_inbox(test_user_1, api_client, test_user_1_access_token, mailoutbox):    
    new_email = 'new-email@email.com'
    api_client.credentials(HTTP_AUTHORIZATION='Bearer ' + test_user_1_access_token)
    resp = api_client.post(
        '/api/user/update_email/',
        data={
            'password': TEST_USER_1_PASSWORD,
            'email': new_email,
        }
    )
    assert resp.status_code == 200
    assert len(mailoutbox) == 1
    assert mailoutbox[0].subject == 'Email verification'
    assert mailoutbox[0].from_email == 'no-reply@compnay.com'
    assert mailoutbox[0].to[0] == new_email

@pytest.mark.django_db
def test_verified_user_update_email_inbox(test_user_1, api_client, test_user_1_access_token, mailoutbox):   
    test_user_1.email_verified = True
    test_user_1.email_verification_token_date = None
    test_user_1.save()

    assert test_user_1.email_verified == True
    assert test_user_1.email_verification_token_date == None
 
    new_email = 'new-email@email.com'
    api_client.credentials(HTTP_AUTHORIZATION='Bearer ' + test_user_1_access_token)
    resp = api_client.post(
        '/api/user/update_email/',
        data={
            'password': TEST_USER_1_PASSWORD,
            'email': new_email,
        }
    )
    assert resp.status_code == 200
    assert len(mailoutbox) == 1
    assert mailoutbox[0].subject == 'Email verification'
    assert mailoutbox[0].from_email == 'no-reply@compnay.com'
    assert mailoutbox[0].to[0] == new_email

@pytest.mark.django_db
def test_user_email_update_login(client,test_user_1, api_client, test_user_1_access_token):    
    new_email = 'new-email@email.com'
    api_client.credentials(HTTP_AUTHORIZATION='Bearer ' + test_user_1_access_token)
    resp = api_client.post(
        '/api/user/update_email/',
        data={
            'password': TEST_USER_1_PASSWORD,
            'email': new_email,
        }
    )
    assert resp.status_code == 200
    assert resp.data['detail'] == 'Email updated successfully.'
    # Login with new password and email
    resp = client.post(
        "/api/log_in/",
        {
            "username": new_email,
            "password": TEST_USER_1_PASSWORD
        }
    )
    assert resp.status_code == 200


