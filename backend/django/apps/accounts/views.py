from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from apps.accounts.serializers import (
    LoginSerializer
)

from apps.accounts.services import (
    MockAuthService
)


class MockLoginView(APIView):
    authentication_classes = []
    permission_classes = []


    def post(self, request):

        serializer = LoginSerializer( data=request.data )
        serializer.is_valid( raise_exception=True )
        result = MockAuthService.login(
            serializer.validated_data["email"],
            serializer.validated_data["password"]
        )

        if not result:
            return Response(
                {
                    "detail":
                    "Invalid credentials"
                },
                status=status.HTTP_401_UNAUTHORIZED
            )

        return Response(result)