import pytest
from tests.deals.testing_fixtures import (
    test_user_3_verified, test_deal_1, api_client, test_user_3_access_token,
    test_user_1, test_user_1_access_token)

from deals.models import Deal
##### ADD VOTE/RATING COUNT CHECK

@pytest.mark.django_db
def test_deal_upvote(test_user_3_verified, test_user_3_access_token, api_client, test_deal_1):
    api_client.credentials(HTTP_AUTHORIZATION='Bearer ' + test_user_3_access_token)
    resp = api_client.post(
        f'/api/deals/{str(test_deal_1.id)}/vote/',
        {
            'vote': True,
        }
    )
    assert resp.status_code == 200
    print(resp.data['deal'])
    assert resp.data['deal']['rated_by_user'] == True
    assert len(resp.data) == 1
    test_deal_1.refresh_from_db()
    assert test_deal_1.rating == 1

@pytest.mark.django_db
def test_deal_downvote(test_user_3_verified, test_user_3_access_token, api_client, test_deal_1):
    api_client.credentials(HTTP_AUTHORIZATION='Bearer ' + test_user_3_access_token)
    resp = api_client.post(
        f'/api/deals/{str(test_deal_1.id)}/vote/',
        {
            'vote': False,
        }
    )
    assert resp.status_code == 200
    assert resp.data['deal']['rated_by_user'] == False
    test_deal_1.refresh_from_db()
    assert test_deal_1.rating == -1

@pytest.mark.django_db
def test_deal_unvote(test_user_3_verified, test_user_3_access_token, api_client, test_deal_1):
    api_client.credentials(HTTP_AUTHORIZATION='Bearer ' + test_user_3_access_token)
    resp = api_client.post(
        f'/api/deals/{str(test_deal_1.id)}/vote/',
        {
            'vote': True,
        }
    )
    test_deal_1.refresh_from_db()
    assert test_deal_1.rating == 1

    resp = api_client.post(
        f'/api/deals/{str(test_deal_1.id)}/vote/',
        {
            'vote': '',
        }
    )
    test_deal_1.refresh_from_db()
    assert test_deal_1.rating == 0

@pytest.mark.django_db
def test_deal_upvote_not_verified(
    test_user_3_verified, api_client, test_deal_1, test_user_1, test_user_1_access_token):
    api_client.credentials(HTTP_AUTHORIZATION='Bearer ' + test_user_1_access_token)
    resp = api_client.post(
        f'/api/deals/{str(test_deal_1.id)}/vote/',
        {
            'vote': True,
        }
    )
    assert resp.status_code == 403
    assert resp.data['detail'] == 'You do not have permission to perform this action.'

@pytest.mark.django_db
def test_deal_upvote_invalid_auth(test_user_3_verified, api_client, test_deal_1):
    api_client.credentials(HTTP_AUTHORIZATION='Bearer ' + 'invalid-token')
    resp = api_client.post(
        f'/api/deals/{str(test_deal_1.id)}/vote/',
        {
            'vote': True,
        }
    )
    assert resp.status_code == 401
    assert resp.data['detail'] == 'Given token not valid for any token type'

@pytest.mark.django_db
def test_deal_upvote_no_auth(test_user_3_verified, api_client, test_deal_1):
    resp = api_client.post(
        f'/api/deals/{str(test_deal_1.id)}/vote/',
        {
            'vote': True,
        }
    )
    assert resp.status_code == 401
    assert resp.data['detail'] == 'Authentication credentials were not provided.'
