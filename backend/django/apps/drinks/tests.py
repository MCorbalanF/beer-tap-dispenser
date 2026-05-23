from rest_framework.test import APITestCase
from rest_framework import status

from apps.drinks.models import Drink
from apps.accounts.constants import ADMIN_TOKEN
import os

API_VERSION = f"v{os.getenv('API_VERSION', '1')}"


class DrinkTests(APITestCase):

    def setUp(self):

        self.drink = Drink.objects.create(
            name="Estrella",
            description="Beer",
            price_per_liter=5
        )

    def test_list_drinks_public(self):

        response = self.client.get(f"/api/{API_VERSION}/drinks/")

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

    def test_list_drinks_authenticated(self):

        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {ADMIN_TOKEN}"
        )

        response = self.client.get(f"/api/{API_VERSION}/drinks/")

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

    def test_create_drink(self):

        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {ADMIN_TOKEN}"
        )

        response = self.client.post(f"/api/{API_VERSION}/drinks/", {
            "name": "Heineken",
            "description": "Dutch beer",
            "price_per_liter": 6
        })

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED
        )

        self.assertEqual(
            Drink.objects.count(),
            2
        )