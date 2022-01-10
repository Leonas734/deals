from datetime import datetime

from django.template.loader import render_to_string, get_template
from django.core.mail import EmailMultiAlternatives

from django.conf import settings
from django.utils.crypto import constant_time_compare, salted_hmac
from django.utils.http import base36_to_int, int_to_base36


class EmailVerificationTokenGenerator:
    """
    Strategy object used to generate and check tokens for the email
    reset mechanism. This is a modified version of the 
    PasswordResetTokenGenerator that comes with django
    """
    key_salt = "deals.utils.EmailVerificationTokenGenerator"
    algorithm = None
    _secret = None

    def __init__(self):
        self.algorithm = self.algorithm or 'sha256'

    def _get_secret(self):
        return self._secret or settings.SECRET_KEY

    def _set_secret(self, secret):
        self._secret = secret

    secret = property(_get_secret, _set_secret)

    def make_token(self, user):
        """
        Return a token that can be used once to do a email verification
        for the given user.
        """
        if user.email_verified or user.email_verification_token_date == None:
            raise ValueError("Email verified or invalid date field detected.")
        return self._make_token_with_timestamp(user, self._num_seconds(self._now()))

    def check_token(self, user, token):
        """
        Check that a email verification token is correct for a given user.
        """
        if not (user and token):
            return False
        # Parse the token
        try:
            ts_b36, _ = token.split("-")
        except ValueError:
            return False

        try:
            ts = base36_to_int(ts_b36)
        except ValueError:
            return False

        # Check that the timestamp/uid has not been tampered with
        if not constant_time_compare(self._make_token_with_timestamp(user, ts), token):
            return False

        # Check the timestamp is within limit.
        if (self._num_seconds(self._now()) - ts) > settings.EMAIL_VERIFICATION_TIMEOUT:
            return False

        return True

    def _make_token_with_timestamp(self, user, timestamp):
        # timestamp is number of seconds since 2001-1-1. Converted to base 36,
        # this gives us a 6 digit string until about 2069.
        ts_b36 = int_to_base36(timestamp)
        hash_string = salted_hmac(
            self.key_salt,
            self._make_hash_value(user, timestamp),
            secret=self.secret,
            algorithm=self.algorithm,
        ).hexdigest()[::2]  # Limit to shorten the URL.
        return "%s-%s" % (ts_b36, hash_string)

    def _make_hash_value(self, user, timestamp):
        """
        Hash the user's primary key, email, and some user state
        that's sure to change after each email verification request 
        to produce a token that is invalidated when it's used:
        1. The email_token_verification_date field will change
           every time user requests a verification link.
        2. The last_login field will usually be updated very shortly after
           an email verification.
        Failing those things, settings.EMAIL_VERIFICATION_TIMEOUT eventually
        invalidates the token.
        Running this data through salted_hmac() prevents cracking
        attempts using the verification token, provided the secret isn't compromised.
        """
        # Truncate microseconds so that tokens are consistent even if the
        # database doesn't support microseconds.
        email_verification_timestamp = user.email_verification_token_date.replace(microsecond=0, tzinfo=None)
        email = user.email
        return f'{user.pk}{email_verification_timestamp}{timestamp}{email}'

    def _num_seconds(self, dt):
        return int((dt - datetime(2001, 1, 1)).total_seconds())

    def _now(self):
        # Used for mocking in tests
        return datetime.now()
email_token_generator = EmailVerificationTokenGenerator()

class SendEmail:

    def __init__(self):
        self.company_email = "no-reply@compnay.com"
        self.url = "http://localhost:8000"

    def send_verification_for_email_address(self, user):
        token = email_token_generator.make_token(user)
        data = {
            "username": user.username,
            "url": self.url+f"/api/user/{user.id}/verify_email/{token}/",
        }
        html_template = render_to_string("deals/email_templates/verify_email.html", data)
        text_template = render_to_string("deals/email_templates/verify_email.txt", data)

        subject, from_email, to =  "Email verification", self.company_email, user.email
        text_content = text_template
        html_content = html_template
        msg = EmailMultiAlternatives(subject, text_content, from_email, [to])
        msg.attach_alternative(html_content, "text/html")
        msg.send()
send_email = SendEmail()