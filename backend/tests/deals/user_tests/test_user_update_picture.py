import pytest
from PIL import Image, ImageChops
from io import BytesIO
import os

from django.conf import settings
from tests.deals.testing_variables import TEST_USER_1_PASSWORD
from tests.deals.testing_fixtures import test_user_1, api_client, test_user_1_access_token

@pytest.mark.django_db
def test_update_picture(test_user_1, api_client, test_user_1_access_token):
    api_client.credentials(HTTP_AUTHORIZATION='Bearer ' + test_user_1_access_token)

    new_name = 'new-profile-picture.png'
    file = BytesIO()
    image = Image.new('RGB', (60, 30), color = 'red')
    image.save(file, 'png')
    file.name = new_name
    file.seek(0)

    resp = api_client.post(
        f'/api/user/update_profile_picture/',
        format='multipart',
        data={
            'profile_picture': file,
            'password': TEST_USER_1_PASSWORD
        },
    )
    assert resp.status_code == 200
    assert resp.data['detail'] == 'Profile picture updated successfully.'
    assert len(resp.data) == 2

    test_user_1.refresh_from_db()
    db_image = Image.open(f'{os.getcwd()}/media/{test_user_1.profile_picture.name}')    
    assert ImageChops.difference(image, db_image).getbbox() == None
    assert test_user_1.profile_picture.name == f'{settings.PROFILE_PICTURE_DIR}/{new_name}'
    # Delete test image file
    os.remove(f'{os.getcwd()}/media/{test_user_1.profile_picture.name}')

@pytest.mark.django_db
def test_update_picture_no_auth(test_user_1, api_client):
    new_name = 'new-profile-picture.png'
    file = BytesIO()
    image = Image.new('RGB', (60, 30), color = 'red')
    image.save(file, 'png')
    file.name = new_name
    file.seek(0)

    resp = api_client.post(
        f'/api/user/update_profile_picture/',
        format='multipart',
        data={
            'profile_picture': file,
            'password': TEST_USER_1_PASSWORD
        },
    )
    assert resp.status_code == 401
    assert resp.data['detail'] == 'Authentication credentials were not provided.'

@pytest.mark.django_db
def test_update_picture_invalid_auth(api_client):
    api_client.credentials(HTTP_AUTHORIZATION='Bearer ' + "invalid-auth")
    new_name = 'new-profile-picture.png'
    file = BytesIO()
    image = Image.new('RGB', (60, 30), color = 'red')
    image.save(file, 'png')
    file.name = new_name
    file.seek(0)

    resp = api_client.post(
        f'/api/user/update_profile_picture/',
        format='multipart',
        data={
            'profile_picture': file,
            'password': TEST_USER_1_PASSWORD
        },
    )
    assert resp.status_code == 401
    assert resp.data['detail'] == 'Given token not valid for any token type'

@pytest.mark.django_db
def test_update_picture_invalid_file(api_client, test_user_1_access_token):
    api_client.credentials(HTTP_AUTHORIZATION='Bearer ' + test_user_1_access_token)
    resp = api_client.post(
        f'/api/user/update_profile_picture/',
        format='multipart',
        data={
            'profile_picture': "invalid-file",
            'password': TEST_USER_1_PASSWORD
        },
    )
    assert resp.status_code == 400
    assert resp.data['profile_picture'][0] == 'The submitted data was not a file. Check the encoding type on the form.'