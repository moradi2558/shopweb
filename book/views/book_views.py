from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.core.paginator import Paginator
from django.db.models import Q, Count
from django.shortcuts import get_object_or_404
from datetime import datetime, timedelta

from ..serializers import *
from ..models import *


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
        
        serializer = BookListSerializer(page_obj, many=True, context={'request': request})
        
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
        serializer = BookSerializer(book, context={'request': request})
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
    """صفحه اصلی - داده‌های کامل برای صفحه هوم"""
    
    def get(self, request):
        # Previous Reading - کتاب‌های امانت گرفته شده (اگر کاربر لاگین باشد)
        previous_reading = []
        if request.user.is_authenticated:
            from account.models import User
            user_borrows = Borrow.objects.filter(
                user=request.user,
                is_return=False
            ).select_related('book')[:5]
            previous_reading = [borrow.book for borrow in user_borrows]
        else:
            # اگر لاگین نباشد، کتاب‌های تصادفی نشان می‌دهیم
            previous_reading = Book.objects.filter(available_copy__gt=0).order_by('?')[:5]
        
        # New Books - کتاب‌های جدید (بر اساس تاریخ)
        new_books = Book.objects.filter(available_copy__gt=0).order_by('-date')[:6]
        
        # Popular Books - کتاب‌های محبوب (بر اساس تعداد امانت)
        popular_books_qs = Book.objects.annotate(
            borrow_count=Count('borrow')
        ).filter(available_copy__gt=0).order_by('-borrow_count', '-date')
        
        popular_books_list = list(popular_books_qs[:8])
        
        # اگر کتاب محبوب کافی نداریم، کتاب‌های تصادفی اضافه می‌کنیم
        if len(popular_books_list) < 8:
            remaining = 8 - len(popular_books_list)
            popular_ids = [book.id for book in popular_books_list]
            additional = Book.objects.filter(
                available_copy__gt=0
            ).exclude(id__in=popular_ids).order_by('?')[:remaining]
            popular_books_list.extend(list(additional))
        
        popular_books = popular_books_list
        
        # Categories with count
        categories = Category.objects.annotate(
            book_count=Count('book')
        ).order_by('-book_count')
        
        # Special Books - کتاب‌های ویژه (کتاب‌های قابل فروش)
        special_books = Book.objects.filter(
            sell=True,
            available_copy__gt=0
        ).order_by('-date')[:6]
        
        # Authors - استخراج از فیلد author خود کتاب‌ها
        authors_data = []
        author_names = (
            Book.objects.exclude(author__isnull=True)
            .exclude(author__exact='')
            .values_list('author', flat=True)
            .distinct()
        )
        for i, author_name in enumerate(author_names, start=1):
            authors_data.append({'id': i, 'name': author_name})
        
        # Serialize data
        previous_reading_serializer = BookListSerializer(previous_reading, many=True, context={'request': request})
        new_books_serializer = BookListSerializer(new_books, many=True, context={'request': request})
        popular_books_serializer = BookListSerializer(popular_books, many=True, context={'request': request})
        special_books_serializer = BookListSerializer(special_books, many=True, context={'request': request})
        
        categories_data = []
        for cat in categories:
            categories_data.append({
                'id': cat.id,
                'name': cat.name,
                'count': cat.book_count
            })
        
        response_data = {
            'message': 'به کتابخانه خوش آمدید',
            'data': {
                'previous_reading': previous_reading_serializer.data,
                'new_books': new_books_serializer.data,
                'popular_books': popular_books_serializer.data,
                'special_books': special_books_serializer.data,
                'categories': categories_data,
                'authors': authors_data
            }
        }
        
        # Optional: include banners if model exists
        try:
            from ..models import Banner
            banners_qs = Banner.objects.filter(is_active=True).order_by('order')[:4]
            banners_data = []
            for banner in banners_qs:
                if banner.image:
                    img_url = banner.image.url
                    if request:
                        img_url = request.build_absolute_uri(banner.image.url)
                    banners_data.append(
                        {
                            'id': banner.id,
                            'title': banner.title,
                            'image_url': img_url,
                        }
                    )
            response_data['data']['banners'] = banners_data
        except Exception:
            # اگر به هر دلیلی Banner در دسترس نبود، صفحه همچنان کار کند
            pass
        
        return Response(response_data, status=status.HTTP_200_OK)

