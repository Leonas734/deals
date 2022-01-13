from PIL import Image, ImageChops
from io import BytesIO
import os
import pytest
from django.conf import settings
from deals.models import Deal
from tests.deals.testing_fixtures import (
    test_user_3_verified, test_deal_1, api_client, test_user_3_access_token,
    test_user_1, test_user_1_access_token,
    )
from tests.deals.testing_variables import (
    TEST_DEAL_1_TITLE, TEST_DEAL_1_DESCRIPTION, TEST_DEAL_1_CATEOGRY,
    TEST_DEAL_1_SENT_FROM, TEST_DEAL_1_URL, TEST_DEAL_1_PRICE, TEST_DEAL_1_POSTAGE_COST,
    TEST_DEAL_1_DEAL_END_DATE, TEST_DEAL_1_DEAL_START_DATE,
    )
TEST_DEAL_1_BASIC_DATA = {
    'title': TEST_DEAL_1_TITLE,
    'description': TEST_DEAL_1_DESCRIPTION,
    'category': TEST_DEAL_1_CATEOGRY
    }

@pytest.mark.django_db
def test_update_deal_to_postage(test_user_3_verified, test_user_3_access_token, api_client, test_deal_1):
    api_client.credentials(HTTP_AUTHORIZATION='Bearer ' + test_user_3_access_token)
    test_deal_1.instore_only = True
    test_deal_1.save()
    
    resp = api_client.patch(
        f'/api/deal/{str(test_deal_1.id)}/',
        {
            'price': TEST_DEAL_1_PRICE,
            'url': TEST_DEAL_1_URL,
            'postage_cost': TEST_DEAL_1_POSTAGE_COST,
            'sent_from': TEST_DEAL_1_SENT_FROM,
            'deal_start_date': TEST_DEAL_1_DEAL_START_DATE,
            'deal_end_date': TEST_DEAL_1_DEAL_END_DATE,
        }
    )
    assert resp.status_code == 200
    assert resp.data['id'] == str(Deal.objects.first().id)
    assert resp.data['user']['username'] == test_user_3_verified.username
    assert resp.data['user']['profile_picture'] == f'http://testserver/media/{test_user_3_verified.profile_picture}'
    assert resp.data['title'] == TEST_DEAL_1_TITLE
    assert resp.data['description'] == TEST_DEAL_1_DESCRIPTION
    assert resp.data['image'] == f'http://testserver/media/{settings.DEAL_IMAGE_DIR}/{settings.DEFAULT_DEAL_IMAGE}'
    assert resp.data['price'] == TEST_DEAL_1_PRICE
    assert resp.data['url'] == TEST_DEAL_1_URL
    assert resp.data['instore_only'] == False
    assert resp.data['postage_cost'] == TEST_DEAL_1_POSTAGE_COST
    assert resp.data['sent_from'] == TEST_DEAL_1_SENT_FROM
    assert resp.data['deal_start_date'] == TEST_DEAL_1_DEAL_START_DATE
    assert resp.data['deal_end_date'] == TEST_DEAL_1_DEAL_END_DATE
    assert resp.data['created'] != None
    assert resp.data['updated'] != None
    assert resp.data['rating'] == 0
    assert len(resp.data) == 16

@pytest.mark.django_db
def test_update_deal_to_instore(test_user_3_verified, test_user_3_access_token, api_client, test_deal_1):
    api_client.credentials(HTTP_AUTHORIZATION='Bearer ' + test_user_3_access_token)
    test_deal_1.postage_cost =  TEST_DEAL_1_POSTAGE_COST
    test_deal_1.sent_from = TEST_DEAL_1_SENT_FROM
    resp = api_client.patch(
        f'/api/deal/{str(test_deal_1.id)}/',
        {
            'price': TEST_DEAL_1_PRICE,
            'url': TEST_DEAL_1_URL,
            'instore_only': True,
            'deal_start_date': TEST_DEAL_1_DEAL_START_DATE,
            'deal_end_date': TEST_DEAL_1_DEAL_END_DATE,
        }
    )
    assert resp.status_code == 200
    assert resp.data['id'] == str(Deal.objects.first().id)
    assert resp.data['user']['username'] == test_user_3_verified.username
    assert resp.data['user']['profile_picture'] == f'http://testserver/media/{test_user_3_verified.profile_picture}'
    assert resp.data['title'] == TEST_DEAL_1_TITLE
    assert resp.data['description'] == TEST_DEAL_1_DESCRIPTION
    assert resp.data['image'] == f'http://testserver/media/{settings.DEAL_IMAGE_DIR}/{settings.DEFAULT_DEAL_IMAGE}'
    assert resp.data['price'] == TEST_DEAL_1_PRICE
    assert resp.data['url'] == TEST_DEAL_1_URL
    assert resp.data['instore_only'] == True
    assert resp.data['postage_cost'] == '0.00'
    assert resp.data['sent_from'] == None
    assert resp.data['deal_start_date'] == TEST_DEAL_1_DEAL_START_DATE
    assert resp.data['deal_end_date'] == TEST_DEAL_1_DEAL_END_DATE
    assert resp.data['created'] != None
    assert resp.data['updated'] != None
    assert resp.data['rating'] == 0
    assert len(resp.data) == 16

@pytest.mark.django_db
def test_update_deal_image(test_user_3_verified, test_user_3_access_token, api_client, test_deal_1):
    api_client.credentials(HTTP_AUTHORIZATION='Bearer ' + test_user_3_access_token)

    image_name = 'new-deal-picture.png'
    file = BytesIO()
    image = Image.new('RGB', (60, 30), color = 'red')
    image.save(file, 'png')
    file.name = image_name
    file.seek(0)
    
    resp = api_client.patch(
        f'/api/deal/{str(test_deal_1.id)}/',
        format='multipart',
        data={
            'image': file
        }
    )
    assert resp.status_code == 200
    assert len(resp.data) == 16
    assert resp.data['image'] == f'http://testserver/media/{settings.DEAL_IMAGE_DIR}/{image_name}'
    deal = Deal.objects.first()
    # Compare images pixel by pixel to ensure they match
    db_image = Image.open(f'{os.getcwd()}/media/{deal.image}')
    print(db_image)
    print(db_image)
    assert ImageChops.difference(image, db_image).getbbox() == None
    assert deal.image.name == f'{settings.DEAL_IMAGE_DIR}/{image_name}'
    # Delete test image file
    os.remove(f'{os.getcwd()}/media/{deal.image.name}')

@pytest.mark.django_db
def test_update_deal_invalid_dates(test_user_3_verified, test_user_3_access_token, api_client, test_deal_1):
    api_client.credentials(HTTP_AUTHORIZATION='Bearer ' + test_user_3_access_token)
    resp = api_client.patch(
        f'/api/deal/{str(test_deal_1.id)}/',
        {
            'deal_start_date': TEST_DEAL_1_DEAL_END_DATE,
            'deal_end_date': TEST_DEAL_1_DEAL_START_DATE
        }
    )

    assert resp.status_code == 400
    assert len(resp.data) == 1
    assert resp.data['detail'][0] == 'Invalid dates.'

@pytest.mark.django_db
def test_update_deal_instore_and_postage_invalid(
    test_user_3_access_token, test_user_3_verified, api_client, test_deal_1
    ):
    api_client.credentials(HTTP_AUTHORIZATION='Bearer ' + test_user_3_access_token)
    
    resp = api_client.patch(
        f'/api/deal/{str(test_deal_1.id)}/',
        {
            'instore_only': True,
            'postage_cost': TEST_DEAL_1_POSTAGE_COST,
            'sent_from': TEST_DEAL_1_SENT_FROM,
        }
    )
    assert resp.status_code == 400
    assert resp.data['detail'][0] == 'Please select either instore only or shipping only.'

@pytest.mark.django_db
def test_update_deal_not_owner(
    test_user_3_verified, api_client, test_deal_1,
    test_user_1, test_user_1_access_token):
    api_client.credentials(HTTP_AUTHORIZATION='Bearer ' + test_user_1_access_token)
    
    resp = api_client.patch(
        f'/api/deal/{str(test_deal_1.id)}/',
        {
            'title': 'New title.'
        }
    )
    assert resp.status_code == 403
    assert resp.data['detail'] == 'You do not have permission to perform this action.'

@pytest.mark.django_db
def test_update_deal_not_verified(test_user_3_verified, api_client, test_deal_1):    
    resp = api_client.patch(
        f'/api/deal/{str(test_deal_1.id)}/',
        {
            'title': 'New title.'
        }
    )
    assert resp.status_code == 401
    assert resp.data['detail'] == 'Authentication credentials were not provided.'

@pytest.mark.django_db
def test_update_deal_invalid_auth(test_user_3_verified, api_client, test_deal_1):
    api_client.credentials(HTTP_AUTHORIZATION='Bearer ' + 'invalid-auth-token')    
    resp = api_client.patch(
        f'/api/deal/{str(test_deal_1.id)}/',
        {
            'title': 'New title.'
        }
    )
    assert resp.status_code == 401
    assert resp.data['detail'] == 'Given token not valid for any token type'
