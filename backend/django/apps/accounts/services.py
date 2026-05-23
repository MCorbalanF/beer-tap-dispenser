#powered by chatgpt, edited by marc
from apps.accounts.constants import (
    ADMIN_EMAIL,
    ADMIN_PASSWORD,
    ADMIN_TOKEN
)


class MockAuthService:

    @staticmethod
    def login(email, password):

        if (
            email != ADMIN_EMAIL or
            password != ADMIN_PASSWORD
        ):
            return None

        return {
            "token": ADMIN_TOKEN,
            "user": {
                "email": email,
                "role": "admin"
            }
        }

    @staticmethod
    def verify(auth_header):

        if not auth_header:
            return None

        if not auth_header.startswith(
            "Bearer "
        ):
            return None

        try:
            token = auth_header.split(
                "Bearer "
            )[1]

        except IndexError:
            return None

        if token != ADMIN_TOKEN:
            return None

        return {
            "email": ADMIN_EMAIL,
            "role": "admin"
        }