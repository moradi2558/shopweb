from django.contrib.auth import login, logout, authenticate
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .serializers import *
from .models import User, Profile

# Create your views here.


class UserRegisterView(APIView):
    """ثبت‌نام کاربر جدید"""
    
    def post(self, request):
        ser_data = UserRegisterSerializer(data=request.data)
        if ser_data.is_valid():
            data = ser_data.validated_data
            user = User.objects.create_user(
                username=data['username'],
                email=data['email'],
                password=data['password']
            )
            # ایجاد پروفایل برای کاربر جدید
            Profile.objects.create(
                user=user,
                borrow_limit=2,
                warning=0,
                address='',
                phone=0
            )
            return Response({
                'message': 'ثبت‌نام با موفقیت انجام شد',
                'data': UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        else:
            return Response({
                'message': 'خطا در ثبت‌نام',
                'errors': ser_data.errors
            }, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request):
        ser_data = UserRegisterSerializer()
        return Response(ser_data.data, status=status.HTTP_200_OK)


class UserLoginView(APIView):
    """ورود کاربر"""
    
    def post(self, request):
        ser_data = UserLoginSerializer(data=request.data)
        if ser_data.is_valid():
            data = ser_data.validated_data
            username = data['username']
            
            # بررسی اینکه username یک email است یا نه
            try:
                user_obj = User.objects.get(email=username)
                username = user_obj.username
            except User.DoesNotExist:
                pass
            
            user = authenticate(request, username=username, password=data['password'])
            if user is not None:
                login(request, user)
                return Response({
                    'message': 'ورود با موفقیت انجام شد',
                    'data': UserSerializer(user).data
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'message': 'نام کاربری یا رمز عبور اشتباه است'
                }, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({
                'message': 'خطا در اعتبارسنجی',
                'errors': ser_data.errors
            }, status=status.HTTP_400_BAD_REQUEST)


class UserLogoutView(APIView):
    """خروج کاربر"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        logout(request)
        return Response({
            'message': 'خروج با موفقیت انجام شد'
        }, status=status.HTTP_200_OK)
    
    def get(self, request):
        return self.post(request)


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

#----------------------------------------------------------------------