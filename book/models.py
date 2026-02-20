from django.db import models
from account.models import User

# Create your models here.

class Category(models.Model):
    name = models.CharField(max_length = 250)

class Book(models.Model):
    name = models.CharField(max_length = 250)
    sell = models.BooleanField(default = False)
    price = models.PositiveIntegerField(default = 0)
    category = models.ManyToManyField(Category)
    date = models.DateField()
    isbn = models.CharField(max_length = 250,unique = True)
    available_copy = models.IntegerField(default = 1)
    cover_image = models.ImageField(upload_to='book_covers/', blank=True, null=True)
    description = models.TextField(blank=True, null=True)


class Borrow(models.Model):
    user =  models.ForeignKey(User,on_delete = models.CASCADE)
    book = models.ForeignKey(Book,on_delete= models.CASCADE)
    borrow_date = models.DateTimeField()
    return_date = models.DateTimeField()
    is_return = models.BooleanField(default = False)