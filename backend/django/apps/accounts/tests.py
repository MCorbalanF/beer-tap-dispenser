from rest_framework.test import APITestCase
from rest_framework import status
import os
from apps.accounts.constants import (
    ADMIN_EMAIL,
    ADMIN_PASSWORD,
    ADMIN_TOKEN
)

API_VERSION = f"v{os.getenv('API_VERSION', '1')}"
class MockLoginTest(APITestCase):

    def test_login_success(self):

        response = self.client.post(f"/api/{API_VERSION}/auth/login/", {
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            response.data["token"],
            ADMIN_TOKEN
        )

    def test_login_invalid_credentials(self):

        response = self.client.post(f"/api/{API_VERSION}/auth/login/", {
            "email": "wrong@test.com",
            "password": "wrong"
        })

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED
        )