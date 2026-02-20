from .auth_views import (
    UserRegisterView,
    UserLoginView,
    UserLogoutView
)
from .profile_views import (
    ProfileView,
    ProfileUpdateView,
    UserDetailView
)

__all__ = [
    'UserRegisterView',
    'UserLoginView',
    'UserLogoutView',
    'ProfileView',
    'ProfileUpdateView',
    'UserDetailView',
]

