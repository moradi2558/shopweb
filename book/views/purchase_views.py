from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from ..models import Book
from ..serializers import BookSerializer


class BookPurchaseView(APIView):
    """خرید کتاب"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request, book_id):
        book = get_object_or_404(Book, id=book_id)
        
        # بررسی اینکه کتاب برای فروش است
        if not book.sell:
            return Response({
                'message': 'این کتاب برای فروش نیست'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # بررسی موجود بودن
        if book.available_copy <= 0:
            return Response({
                'message': 'این کتاب در حال حاضر موجود نیست'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # کاهش تعداد نسخه موجود
        book.available_copy -= 1
        book.save()
        
        return Response({
            'message': 'خرید با موفقیت انجام شد',
            'book': BookSerializer(book).data,
            'price': book.price
        }, status=status.HTTP_200_OK)

