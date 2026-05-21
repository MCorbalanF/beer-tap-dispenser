from django.db import models
from apps.drinks.models import Drink
# Create your models here.
from django.utils import timezone
from decimal import Decimal


class TimeStampedModel(models.Model):

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        abstract = True

class Dispenser(TimeStampedModel):
    name = models.CharField(max_length=100)
    drink = models.ForeignKey(
        Drink, 
        on_delete=models.SET_NULL, 
        related_name='dispensers',
        null=True, 
        blank=True
    )
    
    flow_volume = models.FloatField(help_text="Flow volume in liters per second")
    is_open = models.BooleanField(default=False)
    
    def __str__(self):
        return self.name


class DispenserUsage(TimeStampedModel):
    dispenser = models.ForeignKey(Dispenser, on_delete=models.CASCADE, related_name='usages')
    
    opened_at = models.DateTimeField()
    closed_at = models.DateTimeField(null=True, blank=True)
    duration_seconds = models.FloatField(null=True, blank=True)  # Duration in seconds
    liters_served = models.FloatField(null=True, blank=True)  # Liters served
    total_price = models.DecimalField(max_digits=8, decimal_places=2, default=0, null=True, blank=True)
    
    def __str__(self):
        return f"Usage of {self.dispenser.name} from {self.opened_at} to {self.closed_at or 'now'}"
    
    
    @property
    def is_active(self):
        return self.closed_at is None
    
    def close_usage(self):

        self.closed_at = timezone.now()

        duration = (
            self.closed_at - self.opened_at
        ).total_seconds()

        self.duration_seconds = duration

        self.liters_served = (
            duration * self.dispenser.flow_volume
        )

        self.total_price = Decimal(
            self.liters_served *
            float(self.dispenser.drink.price_per_liter)
        )

        self.save()