import pytest
import time

from tests.deals.testing_fixtures import test_user_1, test_user_2
from deals.utils import email_token_generator

@pytest.mark.django_db
def test_user_email_verification_success(client, test_user_1):
    token = email_token_generator.make_token(test_user_1)
    resp = client.post(
        f'/api/user/{test_user_1.id}/verify_email/{token}/',
    )
    assert resp.status_code == 200
    assert resp.data['detail'] == 'Email successfully verified.'
    test_user_1.refresh_from_db()
    assert test_user_1.email_verified == True
    assert test_user_1.email_verification_token_date == None

@pytest.mark.django_db
def test_user_email_verification_invalid_token(client, test_user_1):
    token = 'invalid-token'
    resp = client.post(
        f'/api/user/{test_user_1.id}/verify_email/{token}/',
    )
    assert resp.status_code == 400
    assert resp.data['detail'] == 'Email already verified or the verification link has expired.'
    test_user_1.refresh_from_db()
    assert test_user_1.email_verified == False
    assert test_user_1.email_verification_token_date != None

@pytest.mark.django_db
def test_user_email_verification_already_verified(client, test_user_1):
    token = email_token_generator.make_token(test_user_1)
    resp = client.post(
        f'/api/user/{test_user_1.id}/verify_email/{token}/',
    )
    resp = client.post(
        f'/api/user/{test_user_1.id}/verify_email/{token}/',
    )
    assert resp.status_code == 400
    assert resp.data['detail'] == 'Email already verified or the verification link has expired.'

@pytest.mark.django_db
def test_user_email_verification_incorrect_user_id(client, test_user_1, test_user_2):
    token = email_token_generator.make_token(test_user_1)
    resp = client.post(
        f'/api/user/{test_user_2.id}/verify_email/{token}/',
    )
    assert resp.status_code == 400
    assert resp.data['detail'] == 'Email already verified or the verification link has expired.'

@pytest.mark.django_db
def test_user_email_verification_new_token(client, settings, test_user_1):
    # Change token expiration time to 1 second
    settings.EMAIL_VERIFICATION_TIMEOUT = 1
    old_token = email_token_generator.make_token(test_user_1)
    time.sleep(2)
    new_token = email_token_generator.make_token(test_user_1)
    assert new_token != old_token
    resp = client.post(
        f'/api/user/{test_user_1.id}/verify_email/{new_token}/',
    )
    assert resp.status_code == 200
    assert resp.data['detail'] == 'Email successfully verified.'

@pytest.mark.django_db
def test_user_email_verification_expired_token(client, settings, test_user_1):
    # Change token expiration time to 1 second
    settings.EMAIL_VERIFICATION_TIMEOUT = 1
    old_token = email_token_generator.make_token(test_user_1)
    time.sleep(2)
    new_token = email_token_generator.make_token(test_user_1)
    assert old_token != new_token
    resp = client.post(
        f'/api/user/{test_user_1.id}/verify_email/{old_token}/',
    )
    assert resp.status_code == 400
    assert resp.data['detail'] == 'Email already verified or the verification link has expired.'

@pytest.mark.django_db
def test_user_email_verification_inbox_email(mailoutbox, client, test_user_1):
    assert len(mailoutbox) == 1
    assert mailoutbox[0].subject == 'Email verification'
    assert mailoutbox[0].from_email == 'no-reply@compnay.com'
    assert mailoutbox[0].to[0] == test_user_1.email