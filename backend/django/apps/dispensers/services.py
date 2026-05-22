#powered by chatgpt, edited by marc

from django.db import transaction
from django.utils import timezone

from apps.dispensers.models import (
    Dispenser,
    DispenserUsage
)


class DispenserService:

    @staticmethod
    @transaction.atomic
    def toggle_dispenser(dispenser: Dispenser):

        dispenser = (
            Dispenser.objects
            .select_for_update()
            .get(id=dispenser.id)
        )

        # OPEN DISPENSER
        if not dispenser.is_open:

            dispenser.is_open = True
            dispenser.save()

            usage = DispenserUsage.objects.create(
                dispenser=dispenser,
                opened_at=timezone.now(),
            )

            return {
                "status": "opened",
                "usage": usage
            }

        # CLOSE DISPENSER
        usage = (
            dispenser.usages
            .filter(closed_at__isnull=True)
            .order_by("-opened_at")
            .first()
        )

        if usage:
            usage.close_usage()

        dispenser.is_open = False
        dispenser.save()

        return {
            "status": "closed",
            "usage": usage
        }

class DispenserMetricsService:

    @staticmethod
    def calculate(dispenser):
        usages = dispenser.usages.all()

        total_usages = usages.count()
        total_liters = sum(u.liters_served or 0 for u in usages)
        total_revenue = sum(u.total_price or 0 for u in usages)

        return {
            "total_usages": total_usages,
            "total_liters": total_liters,
            "total_revenue": total_revenue,
        }