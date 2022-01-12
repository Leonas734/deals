import pytest

from tests.deals.testing_fixtures import test_user_1, test_user_1_access_token, api_client
from tests.deals.testing_variables import TEST_USER_1_PASSWORD

@pytest.mark.django_db
def test_update_password_field(client, test_user_1, api_client, test_user_1_access_token):    
    new_password = 'new-password'
    api_client.credentials(HTTP_AUTHORIZATION='Bearer ' + test_user_1_access_token)
    resp = api_client.post(
        '/api/user/update_password/',
        data={
            'password': TEST_USER_1_PASSWORD,
            'new_password': new_password,
            'new_password_repeat': new_password,
        }
    )
    assert resp.status_code == 200
    assert len(resp.data) == 1
    assert resp.data['detail'] == 'Password updated successfully.'
    # Log in with new password.
    resp = client.post(
        '/api/log_in/',
        {
            'username': test_user_1.username,
            'password': new_password
        }
    )
    assert resp.status_code == 200

@pytest.mark.django_db
def test_update_password_non_matching_passwords(api_client, test_user_1_access_token):    
    new_password = 'new-password'
    api_client.credentials(HTTP_AUTHORIZATION='Bearer ' + test_user_1_access_token)
    resp = api_client.post(
        '/api/user/update_password/',
        data={
            'password': TEST_USER_1_PASSWORD,
            'new_password': new_password,
            'new_password_repeat': new_password+'invalid',
        }
    )
    assert resp.status_code == 400
    assert resp.data['new_password'][0] == 'Passwords do not match.'

@pytest.mark.django_db
def test_update_password_current_password(api_client, test_user_1_access_token):    
    api_client.credentials(HTTP_AUTHORIZATION='Bearer ' + test_user_1_access_token)
    resp = api_client.post(
        '/api/user/update_password/',
        data={
            'password': TEST_USER_1_PASSWORD,
            'new_password': TEST_USER_1_PASSWORD,
            'new_password_repeat': TEST_USER_1_PASSWORD
        }
    )
    assert resp.status_code == 400
    assert resp.data['new_password'] == 'Please enter a new password.'

@pytest.mark.django_db
def test_update_password_incorrect_password(api_client, test_user_1_access_token):    
    new_password = 'new-password'
    api_client.credentials(HTTP_AUTHORIZATION='Bearer ' + test_user_1_access_token)
    resp = api_client.post(
        '/api/user/update_password/',
        data={
            'password': TEST_USER_1_PASSWORD+'invalid',
            'new_password': new_password,
            'new_password_repeat': new_password,
        }
    )
    assert resp.status_code == 400
    assert resp.data['password'] == 'Invalid password.'

@pytest.mark.django_db
def test_update_password_invalid_auth(api_client):    
    new_password = 'new-password'
    api_client.credentials(HTTP_AUTHORIZATION='Bearer ' + 'invalid-auth')
    resp = api_client.post(
        '/api/user/update_password/',
        data={
            'password': TEST_USER_1_PASSWORD,
            'new_password': new_password,
            'new_password_repeat': new_password,
        }
    )
    assert resp.status_code == 401
    assert resp.data['detail'] == 'Given token not valid for any token type'
    
@pytest.mark.django_db
def test_update_password_no_auth(api_client):    
    new_password = 'new-password'
    resp = api_client.post(
        '/api/user/update_password/',
        data={
            'password': TEST_USER_1_PASSWORD,
            'new_password': new_password,
            'new_password_repeat': new_password,
        }
    )
    assert resp.status_code == 401
    assert resp.data['detail'] == 'Authentication credentials were not provided.'
