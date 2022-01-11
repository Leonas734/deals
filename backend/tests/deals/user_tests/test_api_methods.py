import pytest
from tests.deals.testing_fixtures import test_user_1, test_user_1_access_token, api_client

ALL_METHODS = ['get', 'post', 'put', 'patch', 'delete']

@pytest.mark.django_db
def test_create_user_default_methods(client):
    allowed_methods = ['post',]
    for method in ALL_METHODS:
        
        resp = getattr(client, method)(
            '/api/sign_up/',
            {}
        )
        if method in allowed_methods:
            assert resp.status_code != 405
        else:
            # 405 == METHOD NOT ALLOWED
            assert resp.status_code == 405

@pytest.mark.django_db
def test_email_verification_methods(client):
    allowed_methods = ['post',]
    for method in ALL_METHODS:
        
        resp = getattr(client, method)(
            '/api/user/invalid-user-id/verify_email/invalid-email-token/',
            {}
        )
        if method in allowed_methods:
            assert resp.status_code != 405
        else:
            # 405 == METHOD NOT ALLOWED
            assert resp.status_code == 405

@pytest.mark.django_db
def test_email_verification_new_token_methods(
    test_user_1, test_user_1_access_token, api_client):
    allowed_methods = ['get',]
    api_client.credentials(HTTP_AUTHORIZATION='Bearer ' + test_user_1_access_token)
    
    for method in ALL_METHODS:
        resp = getattr(api_client, method)(
            '/api/user/verify_email/new_token/',
        )
        if method in allowed_methods:
            assert resp.status_code != 405
        else:
            # 405 == METHOD NOT ALLOWED
            assert resp.status_code == 405
