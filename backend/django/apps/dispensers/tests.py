from django.utils import timezone
from datetime import timezone as dt_timezone
from rest_framework.test import APITestCase
from rest_framework import status
from decimal import Decimal
from apps.drinks.models import Drink
from apps.dispensers.models import (
    Dispenser,
    DispenserUsage
)
import os

API_VERSION = f"v{os.getenv('API_VERSION', '1')}"

class DispenserToggleTests(APITestCase):
    def setUp(self):

        self.drink = Drink.objects.create(
            name="Beer",
            price_per_liter=5
        )

        self.dispenser = Dispenser.objects.create(
            name="Tap 1",
            drink=self.drink,
            flow_volume=0.5
        )

    def test_open_dispenser(self):
        toggle_api =  f"/api/{API_VERSION}/dispensers/{self.dispenser.id}/toggle/"

        response = self.client.post( toggle_api )

        self.dispenser.refresh_from_db()

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertTrue(
            self.dispenser.is_open
        )

        self.assertEqual(
            DispenserUsage.objects.count(),
            1
        )

    def test_close_dispenser(self):
        toggle_api =  f"/api/{API_VERSION}/dispensers/{self.dispenser.id}/toggle/"

        
        self.client.post(toggle_api)
        

        usage = DispenserUsage.objects.first()

        usage.opened_at = timezone.now() - timezone.timedelta(seconds=5)
        usage.created_at = usage.opened_at
        usage.save()

        response = self.client.post(toggle_api) 
        self.dispenser.refresh_from_db()
        #self.assertFalse(self.dispenser.is_open)

        usage.refresh_from_db()

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertFalse(
            self.dispenser.is_open
        )

        self.assertIsNotNone(
            usage.closed_at
        )

    def test_toggle_cooldown(self):

        toggle_api =  f"/api/{API_VERSION}/dispensers/{self.dispenser.id}/toggle/"

        self.client.post(toggle_api)

        response = self.client.post(toggle_api)

        self.assertEqual(
            response.data["status"],
            "opened"
        )


    def test_metrics_data(self):

        DispenserUsage.objects.create(
            dispenser=self.dispenser,
            opened_at = timezone.datetime(2025, 1, 1, 0, 0, 0, tzinfo=dt_timezone.utc),
            closed_at = timezone.datetime(2025, 1, 1, 0, 0, 10, tzinfo=dt_timezone.utc),
            duration_seconds=timezone.timedelta(seconds=10),            
            liters_served=Decimal("5"),
            total_price=Decimal("25.00")
        )

        self.assertEqual(
            DispenserUsage.objects.count(),
            1
    )