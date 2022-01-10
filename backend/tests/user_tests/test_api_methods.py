import pytest


ALL_METOHDS = ["get", "post", "put", "patch", "delete"]

@pytest.mark.django_db
def test_normal_user_methods(client):
    allowed_methods = ["post",]
    for method in ALL_METOHDS:
        
        resp = getattr(client, method)(
            '/api/user/',
            {}
        )
        if method in allowed_methods:
            assert resp.status_code != 405
        else:
            # 405 == METHOD NOT ALLOWED
            assert resp.status_code == 405

@pytest.mark.django_db
def test_email_verification_methods(client):
    allowed_methods = ["post",]
    for method in ALL_METOHDS:
        
        resp = getattr(client, method)(
            '/api/user/',
            {}
        )
        if method in allowed_methods:
            assert resp.status_code != 405
        else:
            # 405 == METHOD NOT ALLOWED
            assert resp.status_code == 405