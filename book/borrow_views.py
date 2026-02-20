from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.core.paginator import Paginator
from django.shortcuts import get_object_or_404
from django.utils import timezone
from datetime import timedelta

from .serializers import BorrowSerializer, BorrowCreateSerializer
from .models import Borrow, Book
from account.models import Profile


class BorrowCreateView(APIView):
    """امانت گرفتن کتاب"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = BorrowCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                'message': 'خطا در اعتبارسنجی داده‌ها',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        book_id = serializer.validated_data['book_id']
        return_date = serializer.validated_data['return_date']
        
        book = get_object_or_404(Book, id=book_id)
        user = request.user
        
        # بررسی موجود بودن کتاب
        if book.available_copy <= 0:
            return Response({
                'message': 'این کتاب در حال حاضر موجود نیست'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # بررسی پروفایل کاربر
        profile, created = Profile.objects.get_or_create(user=user)
        
        # بررسی تعداد امانت‌های فعال کاربر
        active_borrows = Borrow.objects.filter(
            user=user,
            is_return=False
        ).count()
        
        if active_borrows >= profile.borrow_limit:
            return Response({
                'message': f'شما به حداکثر تعداد امانت ({profile.borrow_limit}) رسیده‌اید'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # بررسی اینکه کاربر قبلاً این کتاب را امانت نگرفته باشد (و هنوز برنگردانده باشد)
        existing_borrow = Borrow.objects.filter(
            user=user,
            book=book,
            is_return=False
        ).first()
        
        if existing_borrow:
            return Response({
                'message': 'شما قبلاً این کتاب را امانت گرفته‌اید و هنوز برنگردانده‌اید'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # ایجاد امانت
        borrow = Borrow.objects.create(
            user=user,
            book=book,
            borrow_date=timezone.now(),
            return_date=return_date,
            is_return=False
        )
        
        # کاهش تعداد نسخه موجود
        book.available_copy -= 1
        book.save()
        
        serializer = BorrowSerializer(borrow)
        return Response({
            'message': 'کتاب با موفقیت امانت گرفته شد',
            'data': serializer.data
        }, status=status.HTTP_201_CREATED)


class BorrowReturnView(APIView):
    """بازگرداندن کتاب"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request, borrow_id):
        borrow = get_object_or_404(Borrow, id=borrow_id)
        
        # بررسی اینکه امانت متعلق به کاربر است یا کاربر ادمین است
        if borrow.user != request.user and not request.user.is_admin:
            return Response({
                'message': 'شما اجازه بازگرداندن این کتاب را ندارید'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # بررسی اینکه قبلاً بازگردانده نشده باشد
        if borrow.is_return:
            return Response({
                'message': 'این کتاب قبلاً بازگردانده شده است'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # بازگرداندن کتاب
        borrow.is_return = True
        borrow.save()
        
        # افزایش تعداد نسخه موجود
        borrow.book.available_copy += 1
        borrow.book.save()
        
        # بررسی تاخیر در بازگرداندن
        if timezone.now() > borrow.return_date:
            profile, created = Profile.objects.get_or_create(user=borrow.user)
            profile.warning += 1
            profile.save()
            
            return Response({
                'message': 'کتاب با تاخیر بازگردانده شد. یک هشدار به حساب شما اضافه شد',
                'data': BorrowSerializer(borrow).data
            }, status=status.HTTP_200_OK)
        
        serializer = BorrowSerializer(borrow)
        return Response({
            'message': 'کتاب با موفقیت بازگردانده شد',
            'data': serializer.data
        }, status=status.HTTP_200_OK)


class BorrowListView(APIView):
    """لیست امانت‌های کاربر"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        # اگر کاربر ادمین است، می‌تواند تمام امانت‌ها را ببیند
        if user.is_admin:
            borrows = Borrow.objects.all()
        else:
            borrows = Borrow.objects.filter(user=user)
        
        # فیلتر بر اساس وضعیت بازگشت
        is_return = request.query_params.get('is_return', None)
        if is_return is not None:
            is_return_bool = is_return.lower() == 'true'
            borrows = borrows.filter(is_return=is_return_bool)
        
        # مرتب‌سازی
        borrows = borrows.order_by('-borrow_date')
        
        # Pagination
        page_size = int(request.query_params.get('limit', 10))
        page_number = int(request.query_params.get('page', 1))
        
        paginator = Paginator(borrows, page_size)
        page_obj = paginator.get_page(page_number)
        
        serializer = BorrowSerializer(page_obj, many=True)
        
        return Response({
            'data': serializer.data,
            'count': paginator.count,
            'total_pages': paginator.num_pages,
            'current_page': page_number
        }, status=status.HTTP_200_OK)


class BorrowDetailView(APIView):
    """جزئیات یک امانت"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request, borrow_id):
        borrow = get_object_or_404(Borrow, id=borrow_id)
        
        # بررسی دسترسی
        if borrow.user != request.user and not request.user.is_admin:
            return Response({
                'message': 'شما اجازه مشاهده این امانت را ندارید'
            }, status=status.HTTP_403_FORBIDDEN)
        
        serializer = BorrowSerializer(borrow)
        return Response({
            'data': serializer.data
        }, status=status.HTTP_200_OK)


class MyActiveBorrowsView(APIView):
    """لیست امانت‌های فعال کاربر"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        active_borrows = Borrow.objects.filter(
            user=user,
            is_return=False
        ).order_by('-borrow_date')
        
        serializer = BorrowSerializer(active_borrows, many=True)
        
        return Response({
            'data': serializer.data,
            'count': active_borrows.count()
        }, status=status.HTTP_200_OK)

