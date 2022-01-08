import pytest
import os
from django.contrib.auth import get_user_model

from tests.deals.testing_fixtures import test_user_1
from tests.deals.testing_variables import (
    TEST_USER_1_USERNAME, TEST_USER_1_EMAIL, TEST_USER_1_PASSWORD,
    DEFAULT_PROFILE_PIC, TEST_USER_2_EMAIL, TEST_USER_2_USERNAME,
    TEST_USER_2_PASSWORD,
)

@pytest.mark.django_db
def test_create_user_model(test_user_1):
    assert test_user_1.username == TEST_USER_1_USERNAME
    assert test_user_1.email == TEST_USER_1_EMAIL
    assert test_user_1.profile_picture.name == f'profile_pictures/{DEFAULT_PROFILE_PIC}'
    assert get_user_model().objects.count() == 1
    assert os.path.exists(f'{os.getcwd()}/media/profile_pictures/{DEFAULT_PROFILE_PIC}')

@pytest.mark.django_db
def test_create_user_api_success(client):
    resp = client.post(
        '/api/user/',
        {
            'username': TEST_USER_1_USERNAME,
            'email': TEST_USER_1_EMAIL,
            'password': TEST_USER_1_PASSWORD,
            'password_repeat': TEST_USER_1_PASSWORD
        }
    )
    assert resp.status_code == 201
    assert len(resp.data) == 1
    assert resp.data['username'] == TEST_USER_1_USERNAME
    assert get_user_model().objects.count() == 1

@pytest.mark.django_db
def test_create_user_api_password_not_matching(client):
    resp = client.post(
        '/api/user/',
        {
            'username': TEST_USER_1_USERNAME,
            'email': TEST_USER_1_EMAIL,
            'password': TEST_USER_1_PASSWORD,
            'password_repeat': TEST_USER_1_PASSWORD+'-invalid'
        }
    )
    assert resp.status_code == 400
    assert len(resp.data) == 1
    assert resp.data['password'][0] == "Passwords do not match."
    assert get_user_model().objects.count() == 0

@pytest.mark.django_db
def test_create_user_api_username_already_exists(client, test_user_1):
    resp = client.post(
        '/api/user/',
        {
            'username': TEST_USER_1_USERNAME,
            'email': TEST_USER_2_EMAIL,
            'password': TEST_USER_1_PASSWORD,
            'password_repeat': TEST_USER_1_PASSWORD
        }
    )
    assert resp.status_code == 400
    assert len(resp.data) == 1
    assert resp.data['username'][0] == "A user with that username already exists."
    assert get_user_model().objects.count() == 1

@pytest.mark.django_db
def test_create_user_api_email_already_exists(client, test_user_1):
    resp = client.post(
        '/api/user/',
        {
            'username': TEST_USER_2_USERNAME,
            'email': TEST_USER_1_EMAIL,
            'password': TEST_USER_2_PASSWORD,
            'password_repeat': TEST_USER_2_PASSWORD
        }
    )
    assert resp.status_code == 400
    assert len(resp.data) == 1
    assert resp.data['email'][0] == "A user with that email address already exists."
    assert get_user_model().objects.count() == 1

@pytest.mark.django_db
def test_create_user_api_blank_fields(client):
    resp = client.post(
        '/api/user/',
        {
            'username': "",
            'email': "",
            'password': "",
            'password_repeat': ""
        }
    )
    assert resp.status_code == 400
    assert len(resp.data) == 4
    assert resp.data['username'][0] == "This field may not be blank."
    assert resp.data['email'][0] == "This field may not be blank."
    assert resp.data['password'][0] == "This field may not be blank."
    assert resp.data['password_repeat'][0] == "This field may not be blank."
    assert get_user_model().objects.count() == 0

@pytest.mark.django_db
def test_create_user_api_no_data(client):
    resp = client.post(
        '/api/user/',
        {}
    )
    assert resp.status_code == 400
    assert len(resp.data) == 4
    assert resp.data['username'][0] == "This field is required."
    assert resp.data['email'][0] == "This field is required."
    assert resp.data['password'][0] == "This field is required."
    assert resp.data['password_repeat'][0] == "This field is required."
    assert get_user_model().objects.count() == 0
