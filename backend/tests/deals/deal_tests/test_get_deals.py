import pytest
from django.conf import settings
from deals.models import Deal
from tests.deals.testing_fixtures import (
    test_user_3_verified, test_deal_1, api_client, test_user_3_access_token,
    test_user_1, test_user_1_access_token)
from tests.deals.testing_variables import (
    TEST_DEAL_1_TITLE, TEST_DEAL_1_DESCRIPTION, TEST_DEAL_1_CATEOGRY,
    TEST_DEAL_1_SENT_FROM, TEST_DEAL_1_URL, TEST_DEAL_1_PRICE, TEST_DEAL_1_POSTAGE_COST,
    TEST_DEAL_1_DEAL_END_DATE, TEST_DEAL_1_DEAL_START_DATE,
    )

@pytest.mark.django_db
def test_get_all_deals(test_user_3_verified, api_client, test_deal_1):
    resp = api_client.get(
        '/api/deals/',
    )
    assert resp.status_code == 200
    assert len(resp.data) == 1

@pytest.mark.django_db
def test_get_deal_by_no_auth(test_user_3_verified, api_client, test_deal_1):
    resp = api_client.get(
        f'/api/deals/{test_deal_1.id}/',
    )
    assert resp.status_code == 200
    assert resp.data['id'] == str(Deal.objects.first().id)
    assert resp.data['user']['username'] == test_user_3_verified.username
    assert resp.data['user']['profile_picture'] == f'http://testserver/media/{test_user_3_verified.profile_picture}'
    assert resp.data['title'] == TEST_DEAL_1_TITLE
    assert resp.data['description'] == TEST_DEAL_1_DESCRIPTION
    assert resp.data['image'] == f'http://testserver/media/{settings.DEAL_IMAGE_DIR}/{settings.DEFAULT_DEAL_IMAGE}'
    assert resp.data['price'] == '0.00'
    assert resp.data['url'] == None
    assert resp.data['instore_only'] == False
    assert resp.data['postage_cost'] == '0.00'
    assert resp.data['sent_from'] == None
    assert resp.data['deal_start_date'] == None
    assert resp.data['deal_end_date'] == None
    assert resp.data['created'] != None
    assert resp.data['updated'] == None
    assert resp.data['rating'] == 0
    assert resp.data['rated_by_user'] == None
    assert resp.data['total_comments'] == 0
    assert len(resp.data) == 18

@pytest.mark.django_db
def test_get_deal_by_pk_voted_up_by_user(test_user_3_verified, test_user_3_access_token, api_client, test_deal_1):
    test_deal_1.vote(test_user_3_verified.username, vote=True)

    api_client.credentials(HTTP_AUTHORIZATION='Bearer ' + test_user_3_access_token)
    resp = api_client.get(
        f'/api/deals/{test_deal_1.id}/',
    )
    assert resp.status_code == 200
    assert resp.data['id'] == str(Deal.objects.first().id)
    assert resp.data['user']['username'] == test_user_3_verified.username
    assert resp.data['user']['profile_picture'] == f'http://testserver/media/{test_user_3_verified.profile_picture}'
    assert resp.data['title'] == TEST_DEAL_1_TITLE
    assert resp.data['description'] == TEST_DEAL_1_DESCRIPTION
    assert resp.data['image'] == f'http://testserver/media/{settings.DEAL_IMAGE_DIR}/{settings.DEFAULT_DEAL_IMAGE}'
    assert resp.data['price'] == '0.00'
    assert resp.data['url'] == None
    assert resp.data['instore_only'] == False
    assert resp.data['postage_cost'] == '0.00'
    assert resp.data['sent_from'] == None
    assert resp.data['deal_start_date'] == None
    assert resp.data['deal_end_date'] == None
    assert resp.data['created'] != None
    assert resp.data['updated'] == None
    assert resp.data['rating'] == 1
    assert resp.data['rated_by_user'] == True
    assert resp.data['total_comments'] == 0
    assert len(resp.data) == 18

@pytest.mark.django_db
def test_get_deal_by_pk_voted_down_by_user(test_user_3_verified, test_user_3_access_token, api_client, test_deal_1):
    test_deal_1.vote(test_user_3_verified.username, vote=False)

    api_client.credentials(HTTP_AUTHORIZATION='Bearer ' + test_user_3_access_token)
    resp = api_client.get(
        f'/api/deals/{test_deal_1.id}/',
    )
    assert resp.status_code == 200
    assert resp.data['id'] == str(Deal.objects.first().id)
    assert resp.data['user']['username'] == test_user_3_verified.username
    assert resp.data['user']['profile_picture'] == f'http://testserver/media/{test_user_3_verified.profile_picture}'
    assert resp.data['title'] == TEST_DEAL_1_TITLE
    assert resp.data['description'] == TEST_DEAL_1_DESCRIPTION
    assert resp.data['image'] == f'http://testserver/media/{settings.DEAL_IMAGE_DIR}/{settings.DEFAULT_DEAL_IMAGE}'
    assert resp.data['price'] == '0.00'
    assert resp.data['url'] == None
    assert resp.data['instore_only'] == False
    assert resp.data['postage_cost'] == '0.00'
    assert resp.data['sent_from'] == None
    assert resp.data['deal_start_date'] == None
    assert resp.data['deal_end_date'] == None
    assert resp.data['created'] != None
    assert resp.data['updated'] == None
    assert resp.data['rating'] == -1
    assert resp.data['rated_by_user'] == False
    assert resp.data['total_comments'] == 0
    assert len(resp.data) == 18

@pytest.mark.django_db
def test_get_deal_by_pk_no_votes(test_user_3_verified, test_user_3_access_token, api_client, test_deal_1):
    api_client.credentials(HTTP_AUTHORIZATION='Bearer ' + test_user_3_access_token)
    resp = api_client.get(
        f'/api/deals/{test_deal_1.id}/',
    )
    assert resp.status_code == 200
    assert resp.data['id'] == str(Deal.objects.first().id)
    assert resp.data['user']['username'] == test_user_3_verified.username
    assert resp.data['user']['profile_picture'] == f'http://testserver/media/{test_user_3_verified.profile_picture}'
    assert resp.data['title'] == TEST_DEAL_1_TITLE
    assert resp.data['description'] == TEST_DEAL_1_DESCRIPTION
    assert resp.data['image'] == f'http://testserver/media/{settings.DEAL_IMAGE_DIR}/{settings.DEFAULT_DEAL_IMAGE}'
    assert resp.data['price'] == '0.00'
    assert resp.data['url'] == None
    assert resp.data['instore_only'] == False
    assert resp.data['postage_cost'] == '0.00'
    assert resp.data['sent_from'] == None
    assert resp.data['deal_start_date'] == None
    assert resp.data['deal_end_date'] == None
    assert resp.data['created'] != None
    assert resp.data['updated'] == None
    assert resp.data['rating'] == 0
    assert resp.data['rated_by_user'] == None
    assert resp.data['total_comments'] == 0
    assert len(resp.data) == 18

@pytest.mark.django_db
def test_get_deal_by_category(test_user_3_verified, api_client, test_deal_1):
    resp = api_client.get(
        f'/api/deals/{test_deal_1.category}/category/',
    )
    assert resp.status_code == 200
    assert len(resp.data) == 1
    assert resp.data[0]['category'] == test_deal_1.category