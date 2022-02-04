import pytest
from tests.deals.testing_fixtures import (
    api_client, test_user_3_verified, test_user_3_access_token,
    test_deal_1
    )

ALL_METHODS = ['get', 'post', 'put', 'patch', 'delete']

@pytest.mark.django_db
def test_deal_comment_create_methods(api_client, test_user_3_verified, test_user_3_access_token):
    api_client.credentials(HTTP_AUTHORIZATION='Bearer ' + test_user_3_access_token)
    allowed_methods = ['post']
    for method in ALL_METHODS:
        
        resp = getattr(api_client, method)(
            '/api/deal_comment/',
            {}
        )
        if method in allowed_methods:
            assert resp.status_code != 405
        else:
            # 405 == METHOD NOT ALLOWED
            assert resp.status_code == 405

@pytest.mark.django_db
def test_deal_comment_retrieve_method(client):
    allowed_methods = ['get']
    for method in ALL_METHODS:
        
        resp = getattr(client, method)(
            '/api/deal_comment/1/',
            {}
        )
        if method in allowed_methods:
            assert resp.status_code != 405
        else:
            # 405 == METHOD NOT ALLOWED
            assert resp.status_code == 405

@pytest.mark.django_db
def test_deal_comment_get_all_deal_comments(api_client, test_user_3_verified, test_user_3_access_token):
    api_client.credentials(HTTP_AUTHORIZATION='Bearer ' + test_user_3_access_token)
    allowed_methods = ['get']
    for method in ALL_METHODS:
        
        resp = getattr(api_client, method)(
            '/api/deals/1/comments/',
            {}
        )
        if method in allowed_methods:
            assert resp.status_code != 405
        else:
            # 405 == METHOD NOT ALLOWED
            assert resp.status_code == 405

@pytest.mark.django_db
def test_deal_comment_vote(api_client, test_user_3_verified, test_user_3_access_token):
    api_client.credentials(HTTP_AUTHORIZATION='Bearer ' + test_user_3_access_token)
    allowed_methods = ['post']
    for method in ALL_METHODS:
        
        resp = getattr(api_client, method)(
            '/api/deal_comment/1/like/',
            {}
        )
        if method in allowed_methods:
            assert resp.status_code != 405
        else:
            # 405 == METHOD NOT ALLOWED
            assert resp.status_code == 405