# api/pipeline.py
from rest_framework_simplejwt.tokens import RefreshToken

def save_jwt_token(strategy, details, user=None, *args, **kwargs):
    if user:
        refresh = RefreshToken.for_user(user)
        # Almacena los tokens en la sesión
        strategy.session_set('jwt_access_token', str(refresh.access_token))
        strategy.session_set('jwt_refresh_token', str(refresh))
        strategy.session_set('username', user.username)