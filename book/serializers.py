from rest_framework import serializers
from .models import *
from account.serializers import UserSerializer


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class BookSerializer(serializers.ModelSerializer):
    category = CategorySerializer(many=True, read_only=True)
    category_ids = serializers.PrimaryKeyRelatedField(
        many=True, 
        queryset=Category.objects.all(), 
        source='category',
        write_only=True,
        required=False
    )
    cover_image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Book
        fields = '__all__'
        read_only_fields = ['id']
    
    def get_cover_image_url(self, obj):
        if obj.cover_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.cover_image.url)
            return obj.cover_image.url
        return None


class BookListSerializer(serializers.ModelSerializer):
    """Serializer برای لیست کتاب‌ها (بدون جزئیات کامل)"""
    category = CategorySerializer(many=True, read_only=True)
    cover_image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Book
        fields = ['id', 'name', 'price', 'sell', 'available_copy', 'category', 'date', 'cover_image', 'cover_image_url', 'description']
    
    def get_cover_image_url(self, obj):
        if obj.cover_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.cover_image.url)
            return obj.cover_image.url
        return None


class BorrowSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    book = BookSerializer(read_only=True)
    book_id = serializers.PrimaryKeyRelatedField(
        queryset=Book.objects.all(),
        source='book',
        write_only=True
    )
    
    class Meta:
        model = Borrow
        fields = '__all__'
        read_only_fields = ['id', 'user', 'is_return']


class BorrowCreateSerializer(serializers.Serializer):
    """Serializer برای ایجاد امانت"""
    book_id = serializers.IntegerField(required=True)
    return_date = serializers.DateTimeField(required=True)