import pytest
from tests.deals.testing_fixtures import (
    test_user_3_verified, test_deal_1, api_client, test_user_3_access_token,
    test_user_1, test_user_1_access_token)
from deals.models import Deal

@pytest.mark.django_db
def test_delete_deal(test_user_3_verified, test_user_3_access_token, api_client, test_deal_1):
    api_client.credentials(HTTP_AUTHORIZATION='Bearer ' + test_user_3_access_token)
    assert Deal.objects.count() == 1
    resp = api_client.delete(
        f'/api/deals/{str(test_deal_1.id)}/',
    )
    assert resp.status_code == 204

    assert Deal.objects.count() == 0

@pytest.mark.django_db
def test_delete_deal_not_owner(
    test_user_3_verified, test_user_1_access_token, api_client, test_deal_1,
    test_user_1):
    api_client.credentials(HTTP_AUTHORIZATION='Bearer ' + test_user_1_access_token)
    assert Deal.objects.count() == 1
    resp = api_client.delete(
        f'/api/deals/{str(test_deal_1.id)}/',
    )
    assert resp.status_code == 403
    assert resp.data['detail'] == 'You do not have permission to perform this action.'
    assert Deal.objects.count() == 1

@pytest.mark.django_db
def test_delete_deal_invalid_auth(test_user_3_verified, api_client, test_deal_1):
    api_client.credentials(HTTP_AUTHORIZATION='Bearer ' + 'invalid-auth-token')
    assert Deal.objects.count() == 1
    resp = api_client.delete(
        f'/api/deals/{str(test_deal_1.id)}/',
    )
    assert resp.status_code == 401
    assert resp.data['detail'] == 'Given token not valid for any token type'
    assert Deal.objects.count() == 1

@pytest.mark.django_db
def test_delete_deal_no_auth(test_user_3_verified, api_client, test_deal_1):
    assert Deal.objects.count() == 1
    resp = api_client.delete(
        f'/api/deals/{str(test_deal_1.id)}/',
    )
    assert resp.status_code == 401
    assert resp.data['detail'] == 'Authentication credentials were not provided.'
    assert Deal.objects.count() == 1