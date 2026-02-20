from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.db.models import Count, Q
from django.utils import timezone
from datetime import timedelta

from .models import Book, Borrow, Category
from account.models import User, Profile


class LibraryStatsView(APIView):
    """آمار کلی کتابخانه (فقط ادمین)"""
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def get(self, request):
        total_books = Book.objects.count()
        available_books = Book.objects.filter(available_copy__gt=0).count()
        total_borrows = Borrow.objects.count()
        active_borrows = Borrow.objects.filter(is_return=False).count()
        total_users = User.objects.count()
        total_categories = Category.objects.count()
        
        # کتاب‌های محبوب (بیشترین امانت)
        popular_books = Book.objects.annotate(
            borrow_count=Count('borrow')
        ).order_by('-borrow_count')[:5]
        
        from .serializers import BookListSerializer
        popular_books_data = BookListSerializer(popular_books, many=True).data
        
        # امانت‌های با تاخیر
        overdue_borrows = Borrow.objects.filter(
            is_return=False,
            return_date__lt=timezone.now()
        ).count()
        
        return Response({
            'total_books': total_books,
            'available_books': available_books,
            'unavailable_books': total_books - available_books,
            'total_borrows': total_borrows,
            'active_borrows': active_borrows,
            'returned_borrows': total_borrows - active_borrows,
            'overdue_borrows': overdue_borrows,
            'total_users': total_users,
            'total_categories': total_categories,
            'popular_books': popular_books_data
        }, status=status.HTTP_200_OK)


class UserStatsView(APIView):
    """آمار کاربر"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        profile, created = Profile.objects.get_or_create(user=user)
        
        total_borrows = Borrow.objects.filter(user=user).count()
        active_borrows = Borrow.objects.filter(user=user, is_return=False).count()
        returned_borrows = total_borrows - active_borrows
        overdue_borrows = Borrow.objects.filter(
            user=user,
            is_return=False,
            return_date__lt=timezone.now()
        ).count()
        
        return Response({
            'total_borrows': total_borrows,
            'active_borrows': active_borrows,
            'returned_borrows': returned_borrows,
            'overdue_borrows': overdue_borrows,
            'borrow_limit': profile.borrow_limit,
            'remaining_borrow_limit': profile.borrow_limit - active_borrows,
            'warnings': profile.warning
        }, status=status.HTTP_200_OK)

