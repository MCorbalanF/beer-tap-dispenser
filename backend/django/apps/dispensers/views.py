from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from apps.accounts.permissions import IsMockAdmin, PublicIsMockAdmin

from apps.dispensers.models import (
    Dispenser
)

from apps.dispensers.serializers import (
    DispenserDetailSerializer,
    DispenserCardSerializer,
    DispenserCreateUpdateSerializer,
    DispenserUsageSerializer
)

from apps.dispensers.services import DispenserService

#powered by chatgpt, edited by marc


#views publicos
class DispenserListView(generics.ListAPIView):
    queryset = Dispenser.objects.all()
    serializer_class = DispenserCardSerializer

class DispenserDetailView(generics.RetrieveAPIView):
    queryset = Dispenser.objects.all()
    serializer_class = DispenserDetailSerializer
    permission_classes = [PublicIsMockAdmin]

class DispenserToggleView(APIView):
    def post(self, request, pk):

        dispenser = get_object_or_404( Dispenser, pk=pk )
        status_result, usage = DispenserService.toggle_dispenser(dispenser) 

        return Response({
            "status": status_result,
            "usage": (
                DispenserUsageSerializer(usage).data
                if usage else None
            )
        })



#views privados
#creacion y actualizacion de dispensers, solo para admins
class DispenserCreateUpdateView(generics.GenericAPIView):

    queryset = Dispenser.objects.all()
    serializer_class = DispenserCreateUpdateSerializer
    permission_classes = [IsMockAdmin]


    def post(self, request):

        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)
        dispenser = serializer.save()

        return Response(
            DispenserDetailSerializer(dispenser).data,
            status=status.HTTP_201_CREATED
        )


    def patch(self, request, pk):

        dispenser = self.get_object()

        serializer = self.get_serializer(
            dispenser,
            data=request.data,
            partial=True
        )

        serializer.is_valid(raise_exception=True)
        dispenser = serializer.save()

        return Response(
            DispenserDetailSerializer(dispenser).data
        )