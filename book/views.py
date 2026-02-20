from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.core.paginator import Paginator
from django.db.models import Q
from django.shortcuts import get_object_or_404
from datetime import datetime

from .serializers import *
from .models import *


class BookListView(APIView):
    """لیست تمام کتاب‌ها با امکان جستجو و فیلتر"""
    
    def get(self, request):
        books = Book.objects.all()
        
        # جستجو بر اساس نام
        search = request.query_params.get('search', None)
        if search:
            books = books.filter(name__icontains=search)
        
        # فیلتر بر اساس دسته‌بندی
        category_id = request.query_params.get('category', None)
        if category_id:
            books = books.filter(category__id=category_id)
        
        # فیلتر بر اساس قابل فروش بودن
        sell = request.query_params.get('sell', None)
        if sell is not None:
            sell_bool = sell.lower() == 'true'
            books = books.filter(sell=sell_bool)
        
        # فیلتر بر اساس موجود بودن
        available = request.query_params.get('available', None)
        if available is not None:
            available_bool = available.lower() == 'true'
            if available_bool:
                books = books.filter(available_copy__gt=0)
            else:
                books = books.filter(available_copy=0)
        
        # مرتب‌سازی
        order_by = request.query_params.get('order_by', 'id')
        if order_by in ['name', 'price', 'date', 'available_copy']:
            books = books.order_by(order_by)
        
        # Pagination
        page_size = int(request.query_params.get('limit', 10))
        page_number = int(request.query_params.get('page', 1))
        
        paginator = Paginator(books, page_size)
        page_obj = paginator.get_page(page_number)
        
        serializer = BookListSerializer(page_obj, many=True)
        
        return Response({
            'data': serializer.data,
            'count': paginator.count,
            'total_pages': paginator.num_pages,
            'current_page': page_number,
            'next_page': page_obj.has_next(),
            'previous_page': page_obj.has_previous()
        }, status=status.HTTP_200_OK)


class BookDetailView(APIView):
    """جزئیات یک کتاب"""
    
    def get(self, request, book_id):
        book = get_object_or_404(Book, id=book_id)
        serializer = BookSerializer(book)
        return Response({'data': serializer.data}, status=status.HTTP_200_OK)


class BookCreateView(APIView):
    """ایجاد کتاب جدید (فقط ادمین)"""
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def post(self, request):
        serializer = BookSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'کتاب با موفقیت ایجاد شد',
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response({
            'message': 'خطا در ایجاد کتاب',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class BookUpdateView(APIView):
    """به‌روزرسانی کتاب (فقط ادمین)"""
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def put(self, request, book_id):
        book = get_object_or_404(Book, id=book_id)
        serializer = BookSerializer(book, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'کتاب با موفقیت به‌روزرسانی شد',
                'data': serializer.data
            }, status=status.HTTP_200_OK)
        return Response({
            'message': 'خطا در به‌روزرسانی کتاب',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, book_id):
        return self.put(request, book_id)


class BookDeleteView(APIView):
    """حذف کتاب (فقط ادمین)"""
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def delete(self, request, book_id):
        book = get_object_or_404(Book, id=book_id)
        book.delete()
        return Response({
            'message': 'کتاب با موفقیت حذف شد'
        }, status=status.HTTP_200_OK)


class Home(APIView):
    """صفحه اصلی - لیست کتاب‌ها"""
    
    def get(self, request):
        books = Book.objects.filter(available_copy__gt=0)[:10]
        serializer = BookListSerializer(books, many=True)
        return Response({
            'message': 'به کتابخانه خوش آمدید',
            'data': serializer.data
        }, status=status.HTTP_200_OK)
