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
def test_create_deal_db(test_user_3_verified, test_deal_1):
    assert test_deal_1.id != None
    assert test_deal_1.user == test_user_3_verified
    assert test_deal_1.title == TEST_DEAL_1_TITLE
    assert test_deal_1.description == TEST_DEAL_1_DESCRIPTION
    assert test_deal_1.image.name == f'{settings.DEAL_IMAGE_DIR}/{settings.DEFAULT_DEAL_IMAGE}'
    assert test_deal_1.price == 0
    assert test_deal_1.url == None
    assert test_deal_1.category == TEST_DEAL_1_CATEOGRY
    assert test_deal_1.instore_only == False
    assert test_deal_1.postage_cost == 0
    assert test_deal_1.sent_from == None
    assert test_deal_1.deal_start_date == None
    assert test_deal_1.deal_end_date == None
    assert len(test_deal_1.up_votes) == 0
    assert len(test_deal_1.down_votes) == 0
    assert test_deal_1.created != None
    assert test_deal_1.updated == None
    assert test_deal_1.rating == 0

@pytest.mark.django_db
def test_create_deal_basic(test_user_3_verified, test_user_3_access_token, api_client):
    api_client.credentials(HTTP_AUTHORIZATION='Bearer ' + test_user_3_access_token)
    resp = api_client.post(
        '/api/deal/',
        {
            **TEST_DEAL_1_BASIC_DATA,
        }
    )

    assert resp.status_code == 201
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
    assert len(resp.data) == 17

@pytest.mark.django_db
def test_create_deal_postage(test_user_3_verified, test_user_3_access_token, api_client):
    api_client.credentials(HTTP_AUTHORIZATION='Bearer ' + test_user_3_access_token)
    resp = api_client.post(
        '/api/deal/',
        {
            **TEST_DEAL_1_BASIC_DATA,
            'price': TEST_DEAL_1_PRICE,
            'url': TEST_DEAL_1_URL,
            'postage_cost': TEST_DEAL_1_POSTAGE_COST,
            'sent_from': TEST_DEAL_1_SENT_FROM,
            'deal_start_date': TEST_DEAL_1_DEAL_START_DATE,
            'deal_end_date': TEST_DEAL_1_DEAL_END_DATE,
        }
    )

    assert resp.status_code == 201
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
    assert resp.data['updated'] == None
    assert resp.data['rating'] == 1
    assert resp.data['rated_by_user'] == True
    assert len(resp.data) == 17

@pytest.mark.django_db
def test_create_deal_instore(test_user_3_verified, test_user_3_access_token, api_client):
    api_client.credentials(HTTP_AUTHORIZATION='Bearer ' + test_user_3_access_token)
    
    resp = api_client.post(
        '/api/deal/',
        {
            **TEST_DEAL_1_BASIC_DATA,
            'price': TEST_DEAL_1_PRICE,
            'url': TEST_DEAL_1_URL,
            'instore_only': True,
            'deal_start_date': TEST_DEAL_1_DEAL_START_DATE,
            'deal_end_date': TEST_DEAL_1_DEAL_END_DATE,
        }
    )

    assert resp.status_code == 201
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
    assert resp.data['updated'] == None
    assert resp.data['rating'] == 1
    assert resp.data['rated_by_user'] == True
    assert len(resp.data) == 17

@pytest.mark.django_db
def test_create_deal_custom_image(test_user_3_access_token, api_client):
    api_client.credentials(HTTP_AUTHORIZATION='Bearer ' + test_user_3_access_token)

    image_name = 'new-deal-picture.png'
    file = BytesIO()
    image = Image.new('RGB', (60, 30), color = 'red')
    image.save(file, 'png')
    file.name = image_name
    file.seek(0)
    
    resp = api_client.post(
        '/api/deal/',
        format='multipart',
        data={
            **TEST_DEAL_1_BASIC_DATA,
            'image': file
        }
    )
    assert resp.status_code == 201
    assert resp.data['image'] == f'http://testserver/media/{settings.DEAL_IMAGE_DIR}/{image_name}'
    
    deal = Deal.objects.first()
    # Compare images pixel by pixel to ensure they match
    db_image = Image.open(f'{os.getcwd()}/media/{deal.image}')
    assert ImageChops.difference(image, db_image).getbbox() == None
    assert deal.image.name == f'{settings.DEAL_IMAGE_DIR}/{image_name}'
    # Delete test image file
    os.remove(f'{os.getcwd()}/media/{deal.image.name}')

@pytest.mark.django_db
def test_create_deal_required_fields(test_user_3_verified, test_user_3_access_token, api_client):
    api_client.credentials(HTTP_AUTHORIZATION='Bearer ' + test_user_3_access_token)
    resp = api_client.post(
        '/api/deal/',
        {}
    )

    assert resp.status_code == 400
    assert len(resp.data) == 3
    assert resp.data['title'][0] == 'This field is required.'
    assert resp.data['description'][0] == 'This field is required.'
    assert resp.data['category'][0] == 'This field is required.'

@pytest.mark.django_db
def test_create_deal_invalid_choices(test_user_3_verified, test_user_3_access_token, api_client):
    api_client.credentials(HTTP_AUTHORIZATION='Bearer ' + test_user_3_access_token)
    invalid_sent_from = 'Invalid-sent-from-location'
    invalid_category = 'Invalid-category'
    resp = api_client.post(
        '/api/deal/',
        {
            **TEST_DEAL_1_BASIC_DATA,
            'sent_from': invalid_sent_from,
            'category': invalid_category
        }
    )

    assert resp.status_code == 400
    assert len(resp.data) == 2
    assert resp.data['sent_from'][0] == f'"{invalid_sent_from}" is not a valid choice.'
    assert resp.data['category'][0] == f'"{invalid_category}" is not a valid choice.'

@pytest.mark.django_db
def test_create_deal_invalid_dates(test_user_3_verified, test_user_3_access_token, api_client):
    api_client.credentials(HTTP_AUTHORIZATION='Bearer ' + test_user_3_access_token)
    resp = api_client.post(
        '/api/deal/',
        {
            **TEST_DEAL_1_BASIC_DATA,
            'deal_start_date': TEST_DEAL_1_DEAL_END_DATE,
            'deal_end_date': TEST_DEAL_1_DEAL_START_DATE
        }
    )

    assert resp.status_code == 400
    assert len(resp.data) == 1
    assert resp.data['detail'][0] == 'Invalid dates.'

@pytest.mark.django_db
def test_create_deal_postage_and_instore_invalid(test_user_3_verified, test_user_3_access_token, api_client):
    api_client.credentials(HTTP_AUTHORIZATION='Bearer ' + test_user_3_access_token)
    resp = api_client.post(
        '/api/deal/',
        {
            **TEST_DEAL_1_BASIC_DATA,
            'price': TEST_DEAL_1_PRICE,
            'url': TEST_DEAL_1_URL,
            'instore_only': True,
            'postage_cost': TEST_DEAL_1_POSTAGE_COST,
            'sent_from': TEST_DEAL_1_SENT_FROM,
        }
    )

    assert resp.status_code == 400
    assert resp.data['detail'][0] == 'Please select either instore only or shipping only.'

@pytest.mark.django_db
def test_create_deal_no_auth(api_client):
    resp = api_client.post(
        '/api/deal/',
        TEST_DEAL_1_BASIC_DATA
    )
    assert resp.status_code == 401
    assert resp.data['detail'] == 'Authentication credentials were not provided.'

@pytest.mark.django_db
def test_create_deal_invalid_auth(api_client):
    api_client.credentials(HTTP_AUTHORIZATION='Bearer ' + 'invalid-auth')
    resp = api_client.post(
        '/api/deal/',
        TEST_DEAL_1_BASIC_DATA
    )
    assert resp.status_code == 401
    assert resp.data['detail'] == 'Given token not valid for any token type'

@pytest.mark.django_db
def test_create_deal_user_not_verified(test_user_1, test_user_1_access_token, api_client):
    api_client.credentials(HTTP_AUTHORIZATION='Bearer ' + test_user_1_access_token)
    resp = api_client.post(
        '/api/deal/',
        TEST_DEAL_1_BASIC_DATA
    )
    assert resp.status_code == 403
    assert resp.data['detail'] == 'You do not have permission to perform this action.'