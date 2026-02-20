from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from ..serializers import ProfileSerializer, ProfileUpdateSerializer, UserSerializer
from ..models import Profile


class ProfileView(APIView):
    """مشاهده پروفایل کاربر"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        profile, created = Profile.objects.get_or_create(user=request.user)
        serializer = ProfileSerializer(profile)
        
        # تعداد امانت‌های فعال
        from book.models import Borrow
        active_borrows = Borrow.objects.filter(
            user=request.user,
            is_return=False
        ).count()
        
        return Response({
            'data': serializer.data,
            'active_borrows': active_borrows,
            'remaining_borrow_limit': profile.borrow_limit - active_borrows
        }, status=status.HTTP_200_OK)


class ProfileUpdateView(APIView):
    """به‌روزرسانی پروفایل کاربر"""
    permission_classes = [IsAuthenticated]
    
    def put(self, request):
        profile, created = Profile.objects.get_or_create(user=request.user)
        serializer = ProfileUpdateSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'پروفایل با موفقیت به‌روزرسانی شد',
                'data': ProfileSerializer(profile).data
            }, status=status.HTTP_200_OK)
        return Response({
            'message': 'خطا در به‌روزرسانی پروفایل',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request):
        return self.put(request)


class UserDetailView(APIView):
    """جزئیات کاربر"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response({
            'data': serializer.data
        }, status=status.HTTP_200_OK)

