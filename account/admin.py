from django.contrib import admin
from django.contrib.auth.models import Group
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .forms import UserChangeForm,UserCreationForm
from .models import *



class UserAdmin(BaseUserAdmin):
    form = UserChangeForm
    add_form = UserCreationForm
    
    list_display = ('email','username','is_admin',)
    list_filter = ['is_admin']
    
    fieldsets = (
        ('main', {
            "fields": (
                'username','email','password'
            ),
        }),
        ('premission',{
            "fields": (
                'is_admin','is_active','last_login'
            )
        })
    )
    add_fieldsets = (
        ('main', {
            "fields": (
                'username','email','password1','password2'
            ),
        }),
    )
    
    search_fields = ('email','username')
    ordering = ['username']
    filter_horizontal = ()

class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'borrow_limit', 'warning', 'address', 'phone')
    search_fields = ('user__username', 'address')
    list_filter = ('borrow_limit', 'warning')





admin.site.register(User,UserAdmin)
admin.site.unregister(Group)
admin.site.register(Profile, ProfileAdmin)