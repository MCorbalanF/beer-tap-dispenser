from django.core.management.base import BaseCommand
from decimal import Decimal

from apps.drinks.models import Drink
from apps.dispensers.models import Dispenser


BEVERAGE_SEED = {
    "estrella damm": {"price": 2.50, "flow": 0.50},
    "voll-damm": {"price": 3.00, "flow": 0.65},
    "heineken": {"price": 2.80, "flow": 0.55},
    "cruzcampo": {"price": 2.20, "flow": 0.45},
    "estrella galicia": {"price": 2.60, "flow": 0.52},
    "alhambra": {"price": 2.70, "flow": 0.58},
    "coronita": {"price": 3.20, "flow": 0.60},
    "mahou": {"price": 2.40, "flow": 0.50},
    "san miguel": {"price": 2.30, "flow": 0.48},
}


class Command(BaseCommand):

    help = "Bootstrap festival drinks and dispensers"

    def handle(self, *args, **options):

        created_drinks = 0
        created_dispensers = 0

        for name, data in BEVERAGE_SEED.items():

            drink, created = Drink.objects.get_or_create(
                name=name,
                defaults={
                    "price_per_liter": Decimal(str(data["price"]))
                }
            )

            if created:
                created_drinks += 1
                self.stdout.write(
                    self.style.SUCCESS(
                        f"Created drink: {name}"
                    )
                )

            dispenser_exists = Dispenser.objects.filter(
                name=f"{name} dispenser"
            ).exists()

            if not dispenser_exists:

                Dispenser.objects.create(
                    name=f"{name} dispenser",
                    drink=drink,
                    flow_volume=data["flow"]
                )

                created_dispensers += 1

                self.stdout.write(
                    self.style.SUCCESS(
                        f"Created dispenser: {name}"
                    )
                )

        self.stdout.write(
            self.style.WARNING(
                f"\nBootstrap completed:"
            )
        )

        self.stdout.write(
            self.style.WARNING(
                f"Drinks created: {created_drinks}"
            )
        )

        self.stdout.write(
            self.style.WARNING(
                f"Dispensers created: {created_dispensers}"
            )
        )