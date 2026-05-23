from django.db import models

'''
class DrinkType(models.TextChoices):
    BEER = 'beer', 'Beer'
    WINE = 'wine', 'Wine'
    COCKTAIL = 'cocktail', 'Cocktail'
'''

# Create your models here.
class Drink(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    price_per_liter = models.DecimalField(max_digits=5, decimal_places=2)
    #type = models.TextChoiceField(choices=DrinkType.choices, default=DrinkType.BEER)
    #image = models.ImageField(upload_to='drinks_images', blank=True)

    def __str__(self):
        return self.name