from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.core.paginator import Paginator
from django.shortcuts import get_object_or_404

from .serializers import CategorySerializer
from .models import Category


class CategoryListView(APIView):
    """لیست تمام دسته‌بندی‌ها"""
    
    def get(self, request):
        categories = Category.objects.all().order_by('name')
        serializer = CategorySerializer(categories, many=True)
        return Response({
            'data': serializer.data,
            'count': categories.count()
        }, status=status.HTTP_200_OK)


class CategoryDetailView(APIView):
    """جزئیات یک دسته‌بندی"""
    
    def get(self, request, category_id):
        category = get_object_or_404(Category, id=category_id)
        serializer = CategorySerializer(category)
        return Response({
            'data': serializer.data
        }, status=status.HTTP_200_OK)


class CategoryCreateView(APIView):
    """ایجاد دسته‌بندی جدید (فقط ادمین)"""
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def post(self, request):
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'دسته‌بندی با موفقیت ایجاد شد',
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response({
            'message': 'خطا در ایجاد دسته‌بندی',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class CategoryUpdateView(APIView):
    """به‌روزرسانی دسته‌بندی (فقط ادمین)"""
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def put(self, request, category_id):
        category = get_object_or_404(Category, id=category_id)
        serializer = CategorySerializer(category, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'دسته‌بندی با موفقیت به‌روزرسانی شد',
                'data': serializer.data
            }, status=status.HTTP_200_OK)
        return Response({
            'message': 'خطا در به‌روزرسانی دسته‌بندی',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, category_id):
        return self.put(request, category_id)


class CategoryDeleteView(APIView):
    """حذف دسته‌بندی (فقط ادمین)"""
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def delete(self, request, category_id):
        category = get_object_or_404(Category, id=category_id)
        
        # بررسی اینکه آیا کتابی با این دسته‌بندی وجود دارد
        if category.book_set.exists():
            return Response({
                'message': 'نمی‌توان این دسته‌بندی را حذف کرد زیرا کتاب‌هایی با این دسته‌بندی وجود دارد'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        category.delete()
        return Response({
            'message': 'دسته‌بندی با موفقیت حذف شد'
        }, status=status.HTTP_200_OK)


class CategoryBooksView(APIView):
    """لیست کتاب‌های یک دسته‌بندی"""
    
    def get(self, request, category_id):
        category = get_object_or_404(Category, id=category_id)
        books = category.book_set.all()
        
        # Pagination
        page_size = int(request.query_params.get('limit', 10))
        page_number = int(request.query_params.get('page', 1))
        
        paginator = Paginator(books, page_size)
        page_obj = paginator.get_page(page_number)
        
        from .serializers import BookListSerializer
        serializer = BookListSerializer(page_obj, many=True)
        
        return Response({
            'category': CategorySerializer(category).data,
            'books': serializer.data,
            'count': paginator.count,
            'total_pages': paginator.num_pages,
            'current_page': page_number
        }, status=status.HTTP_200_OK)

