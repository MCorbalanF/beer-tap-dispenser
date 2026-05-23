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

        return user is not None