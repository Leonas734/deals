import pytest
from deals.models import Comment
from tests.deals.testing_fixtures import (
    test_user_3_verified, test_user_3_access_token, test_deal_1,
    test_comment_1, api_client, test_user_1, test_user_1_access_token)

@pytest.mark.django_db
def test_like_comment(
    test_user_3_verified, test_deal_1, test_comment_1, api_client, test_user_3_access_token):
    api_client.credentials(HTTP_AUTHORIZATION='Bearer ' + test_user_3_access_token)
    resp = api_client.post(
        f'/api/deal_comment/{test_comment_1.id}/like/'
    )

    assert resp.status_code == 200
    assert resp.data['liked_by_user'] == True
    assert len(resp.data) == 8
    comment = Comment.objects.first()
    assert comment.total_likes == 1
    assert resp.data['total_likes'] == 1

@pytest.mark.django_db
def test_unlike_comment(
    test_user_3_verified, test_deal_1, test_comment_1, api_client, test_user_3_access_token):
    api_client.credentials(HTTP_AUTHORIZATION='Bearer ' + test_user_3_access_token)
    resp = api_client.post(
        f'/api/deal_comment/{test_comment_1.id}/like/'
    )
    # Like the comment
    assert resp.status_code == 200
    assert resp.data['liked_by_user'] == True
    assert len(resp.data) == 8
    comment = Comment.objects.first()
    assert comment.total_likes == 1
    assert resp.data['total_likes'] == 1

    resp = api_client.post(
        f'/api/deal_comment/{test_comment_1.id}/like/'
    )
    
    # Unlike the comment
    assert resp.status_code == 200
    assert resp.data['liked_by_user'] == False
    assert len(resp.data) == 8
    comment = Comment.objects.first()
    assert comment.total_likes == 0
    assert resp.data['total_likes'] == 0

@pytest.mark.django_db
def test_like_comment_no_auth(
    test_user_3_verified, test_deal_1, test_comment_1, api_client):
    resp = api_client.post(
        f'/api/deal_comment/{test_comment_1.id}/like/'
    )
    assert resp.status_code == 401
    assert resp.data['detail'] == 'Authentication credentials were not provided.'

@pytest.mark.django_db
def test_like_comment_invalid_auth(
    test_user_3_verified, test_deal_1, test_comment_1, api_client):
    api_client.credentials(HTTP_AUTHORIZATION='Bearer ' + 'invalid-token')
    resp = api_client.post(
        f'/api/deal_comment/{test_comment_1.id}/like/'
    )
    assert resp.status_code == 401
    assert resp.data['detail'] == 'Given token not valid for any token type'

@pytest.mark.django_db
def test_like_comment_user_not_verified(
    test_user_3_verified, test_deal_1, test_comment_1, api_client, test_user_1,
    test_user_1_access_token):
    api_client.credentials(HTTP_AUTHORIZATION='Bearer ' + test_user_1_access_token)
    resp = api_client.post(
        f'/api/deal_comment/{test_comment_1.id}/like/'
    )

    assert resp.status_code == 403
    assert resp.data['detail'] == 'You do not have permission to perform this action.'