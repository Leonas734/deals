import pytest
from tests.deals.testing_fixtures import (
    api_client, test_user_3_verified, test_user_3_access_token,
    test_deal_1
    )

ALL_METHODS = ['get', 'post', 'put', 'patch', 'delete']

@pytest.mark.django_db
def test_deal_methods(api_client, test_user_3_verified, test_user_3_access_token):
    api_client.credentials(HTTP_AUTHORIZATION='Bearer ' + test_user_3_access_token)
    allowed_methods = ['post', 'get']
    for method in ALL_METHODS:
        
        resp = getattr(api_client, method)(
            '/api/deal/',
            {}
        )
        if method in allowed_methods:
            assert resp.status_code != 405
        else:
            # 405 == METHOD NOT ALLOWED
            assert resp.status_code == 405

@pytest.mark.django_db
def test_deal_methods_pk(
    api_client, test_user_3_verified, test_user_3_access_token,
    test_deal_1):
    api_client.credentials(HTTP_AUTHORIZATION='Bearer ' + test_user_3_access_token)
    allowed_methods = ['delete', 'patch', 'get']
    for method in ALL_METHODS:
        
        resp = getattr(api_client, method)(
            f'/api/deal/{str(test_deal_1.id)}/',
            {}
        )
        if method in allowed_methods:
            assert resp.status_code != 405
        else:
            # 405 == METHOD NOT ALLOWED
            assert resp.status_code == 405
