# powered by chatgpt, edited by marc

from rest_framework import serializers

from apps.drinks.models import Drink


class DrinkSerializer(serializers.ModelSerializer):

    class Meta:
        model = Drink

        fields = [
            "id",
            "name",
            "description",
            "price_per_liter",
        ]

    def validate_price_per_liter(self, value):

        if value <= 0:
            raise serializers.ValidationError(
                "Price must be greater than 0"
            )

        return value