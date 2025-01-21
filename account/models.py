from django.db import models
from django.contrib.auth.models import AbstractBaseUser,PermissionsMixin
from. managers import UserManager

# Create your models here.
class User(AbstractBaseUser,PermissionsMixin):
    username = models.CharField(max_length=250,unique=True)
    email = models.EmailField(max_length=250,unique=True)
    
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    
    objects = UserManager()
    
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']
    
    
    def __str__(self):
        return self.username
    def has_perm(self,perm,obj = None):
        return True
    def has_module_perms(self,app_label):
        return True
    
    @property
    def is_staff(self):
        return self.is_admin
    
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    borrow_limit = models.PositiveIntegerField(default = 2)
    warning = models.PositiveIntegerField(default=0)
    address = models.TextField()
    phone = models.PositiveIntegerField()