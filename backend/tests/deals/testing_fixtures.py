import pytest

from deals.models import CustomUser, Deal, Comment
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
def test_user_3_verified():
    return CustomUser.objects.create_user(
        username=TEST_USER_3_USERNAME,
        email=TEST_USER_3_EMAIL,
        password=TEST_USER_3_PASSWORD,
        email_verified = True,
        email_verification_token_date = None
    )

@pytest.fixture
def test_user_3_access_token(client, test_user_3_verified):
    return client.post(
        '/api/log_in/',
        {
            'username': test_user_3_verified.email,
            'password': TEST_USER_3_PASSWORD
        }
    ).data["access"]
    
    
@pytest.fixture
def api_client():
    from rest_framework.test import APIClient
    return APIClient()

@pytest.fixture
def test_deal_1(test_user_3_verified):
    return Deal.objects.create(
        user=test_user_3_verified, title=TEST_DEAL_1_TITLE, description=TEST_DEAL_1_DESCRIPTION,
        category=TEST_DEAL_1_CATEOGRY
        )

@pytest.fixture
def test_comment_1(test_user_3_verified, test_deal_1):
    return Comment.objects.create(
        user=test_user_3_verified,
        deal = test_deal_1,
        text = TEST_COMMENT_1_TEXT,
    )