from django.conf import settings
import datetime

DEFAULT_PROFILE_PIC = settings.DEFAULT_PROFILE_PICTURE
TEST_USER_1_USERNAME = 'test_user_1'
TEST_USER_1_EMAIL = 'test_user_1@email.com'
TEST_USER_1_PASSWORD = 'test-user-1-password'

TEST_USER_2_USERNAME = 'test_user_2'
TEST_USER_2_EMAIL = 'test_user_2@email.com'
TEST_USER_2_PASSWORD = 'test-user-2-password'

TEST_USER_3_USERNAME = 'test_user_3'
TEST_USER_3_EMAIL = 'test_user_3@email.com'
TEST_USER_3_PASSWORD = 'test-user-3-password'

TEST_DEAL_1_TITLE = 'Grocery shopping voucher!'
TEST_DEAL_1_DESCRIPTION= 'Test Deal 1 description. Text, text, text.'
TEST_DEAL_1_CATEOGRY = 'GROCERIES'
TEST_DEAL_1_SENT_FROM = 'UNITED KINGDOM'
TEST_DEAL_1_URL = 'https://www.testurl.com'
TEST_DEAL_1_PRICE = '29.99'
TEST_DEAL_1_POSTAGE_COST = '3.99'
TEST_DEAL_1_DEAL_START_DATE = (datetime.datetime.now()).strftime('%Y-%m-%d')
TEST_DEAL_1_DEAL_END_DATE= (datetime.datetime.now() + datetime.timedelta(days=1)).strftime('%Y-%m-%d')

TEST_DEAL_2_TITLE = 'Sofa 50 percent off!'
TEST_DEAL_2_DESCRIPTION= 'Test Deal 2 description. Text, text, text.'
TEST_DEAL_2_CATEOGRY = 'HOME & GARDEN'
TEST_DEAL_2_URL = 'https://www.testurl.com'
TEST_DEAL_2_PRICE = '299.99'

TEST_COMMENT_1_TEXT = 'Test comment 1'
TEST_COMMENT_2_TEXT = 'Test comment 2'
