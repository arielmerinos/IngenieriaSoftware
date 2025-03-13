from django.contrib import admin
from django.urls import path,include
from api.views import CreateUserView, UserDetailView, UserTokenView, ScholarshipListView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/user/", UserDetailView.as_view(), name="user_detail"),  
    path("api/user/register/", CreateUserView.as_view(), name="register"),
    path("api/token/", TokenObtainPairView.as_view(), name="get_token"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("api-auth/", include("rest_framework.urls")),
    path('oauth/', include('social_django.urls', namespace='social')),
    path('api/auth/tokens/', UserTokenView.as_view(), name='user_tokens'),
    path('api/scholarships/', ScholarshipListView.as_view(), name='scholarship-list'),
    path("api/", include("api.urls")),
]
