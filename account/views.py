from django.contrib.auth        import login, logout, authenticate
from django.shortcuts           import get_object_or_404
from rest_framework.views       import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response    import Response
from rest_framework             import viewsets,status
from . serializers              import *
from . models                   import User

# Create your views here.

class UserRegisterView(APIView):
    def post(self,request):
        ser_data = UserRegisterSerializer(data = request.POST)
        if ser_data.is_valid():
            data = ser_data.validated_data
            User.objects.create_user(username = data['username'],email = data['email'],password = data['password'])
            return Response(ser_data.data,status = 201)
        else:
            return Response(ser_data.errors,status = 400)
    def get(self,request):
        ser_data = UserRegisterSerializer()
        return Response(ser_data,status = 200)

class UserLoginView(APIView):
    def post(self,request):
        ser_data = UserLoginSerializer(data = request.POST)
        if ser_data.is_valid():
            data = ser_data.validated_data
            try:
                user = authenticate(request,username = User.objects.get(email = data['username']),password = data['password'])
            except:
                user = authenticate(request,username = data['username'],password = data['password'])
            if user is not None:
                login(request,user)
                return Response(ser_data.data,status = 201)
            else:
                return Response({'username or email is not match with password'})
            
class UserLogoutView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self,request):
        logout(request)
        return Response({'you logged out '})

#----------------------------------------------------------------------