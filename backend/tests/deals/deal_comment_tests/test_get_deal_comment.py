import pytest
from tests.deals.testing_fixtures import (
    test_user_3_access_token, test_user_3_verified, test_deal_1,
    test_comment_1)
from tests.deals.testing_variables import TEST_COMMENT_1_TEXT
from deals.models import Comment

@pytest.mark.django_db
def test_get_all_deal_comments(
    client, test_user_3_verified, test_deal_1, test_comment_1):
    
    # Create 2nd comment
    Comment.objects.create(
        user=test_user_3_verified, text=TEST_COMMENT_1_TEXT, deal=test_deal_1
        )

    resp = client.get(
        f'/api/deals/{test_deal_1.id}/comments/'
    )
    assert resp.status_code == 200
    assert len(resp.data) == 2

    for deal in resp.data:
        assert deal['id'] != None
        assert deal['deal'] == test_deal_1.id
        assert len(deal['user']) == 2
        assert deal['user']['username'] == test_user_3_verified.username
        assert deal['user']['profile_picture'] == f'http://testserver/media/{test_user_3_verified.profile_picture}'
        assert deal['text'] == TEST_COMMENT_1_TEXT
        assert deal['quoted_comment_data'] == None
        assert deal['created'] != None
        assert deal['total_likes'] == 0
        assert deal['liked_by_user'] == False
        assert len(deal) == 8

@pytest.mark.django_db
def test_get_single_comment(
    client, test_user_3_verified, test_deal_1, test_comment_1):

    resp = client.get(
        f'/api/deal_comment/{test_comment_1.id}/'
    )
    assert resp.status_code == 200
    assert resp.data['id'] != None
    assert resp.data['deal'] == test_deal_1.id
    assert len (resp.data['user']) == 2
    assert resp.data['user']['username'] == test_user_3_verified.username
    assert resp.data['user']['profile_picture'] == f'http://testserver/media/{test_user_3_verified.profile_picture}'
    assert resp.data['text'] == TEST_COMMENT_1_TEXT
    assert resp.data['quoted_comment_data'] == None
    assert resp.data['created'] != None
    assert resp.data['total_likes'] == 0
    assert resp.data['liked_by_user'] == False
    assert len(resp.data) == 8