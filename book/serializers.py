from rest_framework import serializers
from .models import *
from account.serializers import UserSerializer


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class BookSerializer(serializers.ModelSerializer):
    category = CategorySerializer(many = True, read_only = True)
    class Meta:
        model = Book
        fields = '__all__'
    
class BorrowSerializer(serializers.ModelSerializer):
    user = UserSerializer(many = True, read_only = True)
    book = BookSerializer(many = True, read_only = True)
    class Meta:
        model = Borrow
        fields = '__all__'