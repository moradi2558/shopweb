from django.urls import path
from .views import (
    UserRegisterView,
    UserLoginView,
    UserLogoutView,
    UserDetailView,
    ProfileView,
    ProfileUpdateView,
)

app_name = 'account'

urlpatterns = [
    # Authentication
    path('register/', UserRegisterView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('logout/', UserLogoutView.as_view(), name='logout'),
    
    # User
    path('me/', UserDetailView.as_view(), name='user-detail'),
    
    # Profile
    path('profile/', ProfileView.as_view(), name='profile'),
    path('profile/update/', ProfileUpdateView.as_view(), name='profile-update'),
]
