import pytest
import json
import base64

from tests.deals.testing_variables import TEST_USER_1_PASSWORD
from tests.deals.testing_fixtures import test_user_1, test_user_2

@pytest.mark.django_db
def test_user_login_username_success(client, test_user_1):
    resp = client.post(
        '/api/log_in/',
        {
            'username': test_user_1.username,
            'password': TEST_USER_1_PASSWORD
        }
    )
    assert resp.status_code == 200
    access = resp.data['access']
    header, payload, signature = access.split('.')
    decoded_payload = base64.b64decode(f'{payload}==')
    payload_data = json.loads(decoded_payload)

    assert resp.data['refresh'] != None
    assert payload_data['id'] == str(test_user_1.id)

@pytest.mark.django_db
def test_user_login_email_success(client, test_user_1):
    resp = client.post(
        '/api/log_in/',
        {
            'username': test_user_1.email,
            'password': TEST_USER_1_PASSWORD
        }
    )
    assert resp.status_code == 200
    access = resp.data['access']
    header, payload, signature = access.split('.')
    decoded_payload = base64.b64decode(f'{payload}==')
    payload_data = json.loads(decoded_payload)

    assert resp.data['refresh'] != None
    assert payload_data['id'] == str(test_user_1.id)
    assert payload_data['username'] == test_user_1.username

@pytest.mark.django_db
def test_user_login_invalid_username(client, test_user_1):
    resp = client.post(
        '/api/log_in/',
        {
            'username': test_user_1.username+'invalid',
            'password': TEST_USER_1_PASSWORD
        }
    )
    assert resp.status_code == 401
    assert resp.data['detail'] == 'No active account found with the given credentials'

@pytest.mark.django_db
def test_user_login_invalid_email(client, test_user_1):
    resp = client.post(
        '/api/log_in/',
        {
            'username': test_user_1.email+'invalid',
            'password': TEST_USER_1_PASSWORD
        }
    )
    assert resp.status_code == 401
    assert resp.data['detail'] == 'No active account found with the given credentials'

@pytest.mark.django_db
def test_user_login_invalid_password(client, test_user_1):
    resp = client.post(
        '/api/log_in/',
        {
            'username': test_user_1.email,
            'password': TEST_USER_1_PASSWORD+"invalid"
        }
    )
    assert resp.status_code == 401
    assert resp.data['detail'] == 'No active account found with the given credentials'

@pytest.mark.django_db
def test_user_login_blank_data(client, test_user_1):
    resp = client.post(
        '/api/log_in/',
        {
            'username': "",
            'password': "",
        }
    )
    assert resp.status_code == 400
    assert resp.data["username"][0] == 'This field may not be blank.'
    assert resp.data["password"][0] == 'This field may not be blank.'

@pytest.mark.django_db
def test_user_login_no_data(client, test_user_1):
    resp = client.post(
        '/api/log_in/',
        {}
    )
    assert resp.status_code == 400
    assert resp.data["username"][0] == 'This field is required.'
    assert resp.data["password"][0] == 'This field is required.'
