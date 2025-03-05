from django.urls import path
from .views import *

urlpatterns = [
    path("register/", UserRegisterAPIView.as_view(), name="registro"),
    path("login/", UserLoginAPIView, name="login")
]