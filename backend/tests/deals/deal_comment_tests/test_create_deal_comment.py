import pytest

from tests.deals.testing_fixtures import (
    test_user_3_access_token, test_user_3_verified, test_deal_1,
    test_comment_1, api_client, test_user_1, test_user_1_access_token
    )
from tests.deals.testing_variables import TEST_COMMENT_1_TEXT, TEST_COMMENT_2_TEXT

@pytest.mark.django_db
def test_create_comment_db(test_user_3_verified, test_comment_1, test_deal_1):
    assert test_comment_1.id != None
    assert test_comment_1.user == test_user_3_verified
    assert test_comment_1.deal == test_deal_1
    assert test_comment_1.text == TEST_COMMENT_1_TEXT
    assert test_comment_1.quoted_comment == None
    assert test_comment_1.total_likes == 0
    assert test_comment_1.created != None

@pytest.mark.django_db
def test_create_deal_comment(test_user_3_verified, test_user_3_access_token, api_client, test_deal_1):
    api_client.credentials(HTTP_AUTHORIZATION='Bearer ' + test_user_3_access_token)
    resp = api_client.post(
        '/api/deal_comment/',
        {
            'text': TEST_COMMENT_1_TEXT,
            'deal': test_deal_1.id, 
        }
    )

    assert resp.status_code == 201
    assert resp.data['id'] != None
    assert resp.data['deal'] == test_deal_1.id
    assert len(resp.data['user']) == 4
    assert resp.data['user']['username'] == test_user_3_verified.username
    assert resp.data['user']['profile_picture'] == f'http://testserver/media/{test_user_3_verified.profile_picture}'
    assert resp.data['text'] == TEST_COMMENT_1_TEXT
    assert resp.data['quoted_comment_data'] == None
    assert resp.data['created'] != None
    assert resp.data['total_likes'] == 0
    assert resp.data['liked_by_user'] == False
    assert len(resp.data) == 8

    resp = api_client.get(
        f'/api/deals/{test_deal_1.id}/',
    )
    assert resp.data['total_comments'] == 1

@pytest.mark.django_db
def test_create_comment_quoted(
    test_user_3_verified, test_comment_1, test_user_3_access_token, api_client, test_deal_1):

    api_client.credentials(HTTP_AUTHORIZATION='Bearer ' + test_user_3_access_token)
    resp = api_client.post(
        '/api/deal_comment/',
        {
            'text': TEST_COMMENT_2_TEXT,
            'deal': test_deal_1.id, 
            'quoted_comment': test_comment_1.id
        }
    )
    assert resp.status_code == 201
    assert resp.data['id'] != None
    assert resp.data['deal'] == test_deal_1.id
    assert len(resp.data['user']) == 4
    assert resp.data['user']['username'] == test_user_3_verified.username
    assert resp.data['user']['profile_picture'] == f'http://testserver/media/{test_user_3_verified.profile_picture}'
    assert resp.data['text'] == TEST_COMMENT_2_TEXT
    assert resp.data['created'] != None
    assert resp.data['total_likes'] == 0
    assert resp.data['liked_by_user'] == False
    assert len(resp.data) == 8

    assert len(resp.data['quoted_comment_data']) == 4
    assert resp.data['quoted_comment_data']['id'] == str(test_comment_1.id)
    assert resp.data['quoted_comment_data']['user'] == test_user_3_verified.username
    assert resp.data['quoted_comment_data']['text'] == test_comment_1.text
    assert resp.data['quoted_comment_data']['date'] == test_comment_1.created

    resp = api_client.get(
        f'/api/deals/{test_deal_1.id}/',
    )
    assert resp.data['total_comments'] == 2

@pytest.mark.django_db
def test_create_comment_no_auth(test_user_3_verified, api_client,test_deal_1):
    resp = api_client.post(
        '/api/deal_comment/',
        {
            'text': TEST_COMMENT_1_TEXT,
            'deal': test_deal_1.id, 
        }
    )
    assert resp.status_code == 401
    assert resp.data['detail'] == 'Authentication credentials were not provided.'

@pytest.mark.django_db
def test_create_comment_invalid_auth(test_user_3_verified, api_client, test_deal_1):
    api_client.credentials(HTTP_AUTHORIZATION='Bearer ' + 'invalid-token')
    resp = api_client.post(
        '/api/deal_comment/',
        {
            'text': TEST_COMMENT_1_TEXT,
            'deal': test_deal_1.id, 
        }
    )
    assert resp.status_code == 401
    assert resp.data['detail'] == 'Given token not valid for any token type'

@pytest.mark.django_db
def test_create_comment_user_not_verified(
    test_user_3_verified, api_client, test_deal_1, test_user_1,
    test_user_1_access_token):
    api_client.credentials(HTTP_AUTHORIZATION='Bearer ' + test_user_1_access_token)
    resp = api_client.post(
        '/api/deal_comment/',
        {
            'text': TEST_COMMENT_1_TEXT,
            'deal': test_deal_1.id, 
        }
    )
    assert resp.status_code == 403
    assert resp.data['detail'] == 'You do not have permission to perform this action.'

@pytest.mark.django_db
def test_create_comment_invalid_deal_id(test_user_3_verified, api_client, test_user_3_access_token):
    api_client.credentials(HTTP_AUTHORIZATION='Bearer ' + test_user_3_access_token)
    resp = api_client.post(
        '/api/deal_comment/',
        {
            'text': TEST_COMMENT_1_TEXT,
            'deal': 'invalid-deal'
        }
    )
    assert resp.status_code == 400
    assert resp.data['deal'][0] == '“invalid-deal” is not a valid UUID.'

