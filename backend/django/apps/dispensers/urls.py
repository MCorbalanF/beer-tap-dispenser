from django.urls import path

from apps.dispensers.views import (
    DispenserListView,
    DispenserDetailView,
    DispenserCreateUpdateView,
    DispenserToggleView,
)

urlpatterns = [
    # Public
    path("", DispenserListView.as_view(), name="dispenser-list"),
    path( "<int:pk>/", DispenserDetailView.as_view(), name="dispenser-detail" ),
    # Toggle tap
    path( "<int:pk>/toggle/", DispenserToggleView.as_view(), name="dispenser-toggle" ),



    # Admin
    path( "admin/", DispenserCreateUpdateView.as_view(), name="dispenser-create" ),
    path( "admin/<int:pk>/", DispenserCreateUpdateView.as_view(), name="dispenser-update" ),

]