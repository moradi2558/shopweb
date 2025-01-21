
from django.contrib import admin
from django.urls import path,include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/',include('account.urls',namespace = 'account')),
    path('',include('book.urls',namespace = 'allbook')),
]
