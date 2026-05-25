from rest_framework.permissions import (
    BasePermission
)

from apps.accounts.services import (
    MockAuthService
)



class IsMockAdmin(BasePermission):

    def has_permission( self, request, view ):
        auth_header = request.headers.get("Authorization")
        user = MockAuthService.verify(auth_header)
        request.is_mock_admin = user is not None
        return user is not None


class PublicIsMockAdmin(BasePermission):

    def has_permission( self, request, view ):
        auth_header = request.headers.get("Authorization")
        user = MockAuthService.verify(auth_header)
        request.is_mock_admin = user is not None
        return True
