#powered by chatgpt, edited by marc

from django.db import transaction
from django.utils import timezone
from apps.dispensers.models import Dispenser, DispenserUsage


class DispenserService:

    @staticmethod
    @transaction.atomic
    def toggle_dispenser(dispenser: Dispenser):

        dispenser = (
            Dispenser.objects
            .select_for_update()
            .get(id=dispenser.id)
        )
        
        #proteccion antispam, no se puede abrir y cerrar el dispenser en menos de 1 segundo
        last_usage = (
            dispenser.usages
            .order_by("-opened_at")
            .first()
        )
        
        if last_usage:
            reference_time = (
                last_usage.closed_at
                if last_usage.closed_at
                else last_usage.opened_at
            )
            delta = timezone.now() - reference_time
            
            if delta.total_seconds() <= 1:
                current_status = "opened" if dispenser.is_open else "closed"                
                return current_status, last_usage
        
        # =========================
        # OPEN
        # =========================
        if not dispenser.is_open:

            dispenser.is_open = True
            dispenser.save()

            usage = DispenserUsage.objects.create(
                dispenser=dispenser,
                opened_at=timezone.now()
            )

            return "opened", usage

        # =========================
        # CLOSE
        # =========================

        usage = (
            DispenserUsage.objects
            .select_for_update()
            .filter(
                dispenser=dispenser,
                closed_at__isnull=True
            )
            .order_by("-opened_at")
            .first()
        )

        if not usage:
            # edge case protection
            dispenser.is_open = False
            dispenser.save()
            return "closed", None

        usage.close_usage()

        dispenser.is_open = False
        dispenser.save()

        return "closed", usage