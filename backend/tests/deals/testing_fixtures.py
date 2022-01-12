import pytest

from deals.models import CustomUser
from tests.deals.testing_variables import *

@pytest.fixture
def test_user_1():
    return CustomUser.objects.create_user(
        username=TEST_USER_1_USERNAME,
        email=TEST_USER_1_EMAIL,
        password=TEST_USER_1_PASSWORD
    )

@pytest.fixture
def test_user_1_access_token(client, test_user_1):
    return client.post(
        '/api/log_in/',
        {
            'username': test_user_1.email,
            'password': TEST_USER_1_PASSWORD
        }
    ).data["access"]

@pytest.fixture
def test_user_2():
    return CustomUser.objects.create_user(
        username=TEST_USER_2_USERNAME,
        email=TEST_USER_2_EMAIL,
        password=TEST_USER_2_PASSWORD
    )
    
@pytest.fixture
def api_client():
    from rest_framework.test import APIClient
    return APIClient()