from calendar import c
import pytest
from django.conf import settings
from tests.deals.testing_fixtures import (test_deal_1,
test_user_3_verified, test_user_1)
from tests.deals.testing_variables import (
    DEFAULT_PROFILE_PIC, TEST_USER_3_USERNAME, TEST_USER_1_USERNAME
    )

@pytest.mark.django_db
def test_user_view_with_post(client, test_user_3_verified, test_deal_1 ):
    resp = client.get(
        f'/api/user/{test_user_3_verified.id}/',
    )
    assert resp.status_code == 200
    assert len(resp.data) == 3
    assert resp.data['username'] == TEST_USER_3_USERNAME
    assert resp.data['profile_picture'] == f"""http://testserver/media/{
        settings.PROFILE_PICTURE_DIR}/{DEFAULT_PROFILE_PIC
        }"""
    assert resp.data['total_deals_posted'] == 1

@pytest.mark.django_db
def test_user_view_without_post(client, test_user_3_verified, test_deal_1, test_user_1 ):
    resp = client.get(
        f'/api/user/{test_user_1.id}/',
    )
    assert resp.status_code == 200
    assert len(resp.data) == 3
    assert resp.data['username'] == TEST_USER_1_USERNAME
    assert resp.data['profile_picture'] == f"""http://testserver/media/{
        settings.PROFILE_PICTURE_DIR}/{DEFAULT_PROFILE_PIC
        }"""
    assert resp.data['total_deals_posted'] == 0