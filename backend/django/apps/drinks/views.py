from rest_framework import generics
from .models import Drink
from .serializers import DrinkSerializer
from apps.accounts.permissions import IsMockAdmin


class DrinkListView(generics.ListCreateAPIView):
    queryset = Drink.objects.all()
    serializer_class = DrinkSerializer
    permission_classes = []
    
class DrinkDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Drink.objects.all()
    serializer_class = DrinkSerializer
    permission_classes = [IsMockAdmin]