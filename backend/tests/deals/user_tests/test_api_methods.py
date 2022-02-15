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
            '/api/email_verification/invalid-user-id/invalid-email-token/',
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
            '/api/email_verification/new_token/',
        )
        if method in allowed_methods:
            assert resp.status_code != 405
        else:
            # 405 == METHOD NOT ALLOWED
            assert resp.status_code == 405

@pytest.mark.django_db
def test_update_user_email_methods(
    test_user_1, test_user_1_access_token, api_client):
    allowed_methods = ['post',]
    api_client.credentials(HTTP_AUTHORIZATION='Bearer ' + test_user_1_access_token)
    for method in ALL_METHODS:
        resp = getattr(api_client, method)(
            '/api/user/update_email/',
        )
        if method in allowed_methods:
            assert resp.status_code != 405
        else:
            # 405 == METHOD NOT ALLOWED
            assert resp.status_code == 405

@pytest.mark.django_db
def test_update_user_profile_picture_methods(
    test_user_1, test_user_1_access_token, api_client):
    allowed_methods = ['post',]
    api_client.credentials(HTTP_AUTHORIZATION='Bearer ' + test_user_1_access_token)
    for method in ALL_METHODS:
        resp = getattr(api_client, method)(
            '/api/user/update_profile_picture/',
        )
        if method in allowed_methods:
            assert resp.status_code != 405
        else:
            # 405 == METHOD NOT ALLOWED
            assert resp.status_code == 405

@pytest.mark.django_db
def test_update_user_password_methods(
    test_user_1, test_user_1_access_token, api_client):
    allowed_methods = ['post',]
    api_client.credentials(HTTP_AUTHORIZATION='Bearer ' + test_user_1_access_token)
    for method in ALL_METHODS:
        resp = getattr(api_client, method)(
            '/api/user/update_password/',
        )
        if method in allowed_methods:
            assert resp.status_code != 405
        else:
            # 405 == METHOD NOT ALLOWED
            assert resp.status_code == 405

@pytest.mark.django_db
def test_user_view_metohds(client, test_user_1):
    allowed_methods = ['get',]
    for method in ALL_METHODS:
        resp = getattr(client, method)(
            f'/api/user/{test_user_1.id}/',
            {}
        )
        if method in allowed_methods:
            assert resp.status_code != 405
        else:
            # 405 == METHOD NOT ALLOWED
            assert resp.status_code == 405