# powered by chatgpt, edited by marc

from rest_framework import serializers
from apps.dispensers.models import Dispenser, DispenserUsage
from apps.drinks.serializers import DrinkSerializer
from apps.drinks.models import Drink



class DispenserCardSerializer(serializers.ModelSerializer):
    drink = DrinkSerializer(read_only=True)
    class Meta:
        model = Dispenser
        fields = "__all__"


class DispenserDetailSerializer(serializers.ModelSerializer):
    drink = DrinkSerializer(read_only=True)
    usages = serializers.SerializerMethodField()
    metrics = serializers.SerializerMethodField()

    class Meta:
        model = Dispenser
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        request = self.context.get("request")
        admin = getattr(request, "is_mock_admin", None)
        print(f"Admin in context: {admin} {type(admin)}", flush=True)
        # ❌ sin auth → ocultar campos sensibles
        if not admin:
            print("No admin in context, hiding metrics and usages", flush=True)
            self.fields.pop("metrics", None)
            self.fields.pop("usages", None)

    def get_usages(self, obj):
        usages = obj.usages.order_by('-created_at')
        return DispenserUsageSerializer(usages, many=True).data

    def get_metrics(self, obj):
        return obj.metrics


class DispenserCreateUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Dispenser
        fields = ["name", "drink", "flow_volume"]

    def validate_flow_volume(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "Flow volume must be greater than 0"
            )
        return value
    
    
#Dispenser actions:

class DispenserOpenSerializer(serializers.Serializer):

    def validate(self, attrs):
        dispenser = self.context["dispenser"]

        if dispenser.is_open:
            raise serializers.ValidationError(
                "Dispenser is already open"
            )

        return attrs

class DispenserCloseSerializer(serializers.Serializer):

    def validate(self, attrs):
        dispenser = self.context["dispenser"]

        if not dispenser.is_open:
            raise serializers.ValidationError(
                "Dispenser is already closed"
            )

        return attrs
    
    
#Dispenser usages serializers

class DispenserUsageSerializer(serializers.ModelSerializer):

    class Meta:
        model = DispenserUsage
        fields = "__all__"
        
class DispenserMetricsSerializer(serializers.Serializer):
    total_usages = serializers.IntegerField()
    total_liters = serializers.FloatField()
    total_revenue = serializers.DecimalField(max_digits=10, decimal_places=2)