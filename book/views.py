from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import *
from rest_framework             import status
from django.core.paginator import Paginator
from .models import*
from django.shortcuts import get_object_or_404

# Create your views here.


class Home(APIView):                              
    def get(self,request,slug=None,id=None):

        books = Book.objects.all()
        page_size = self.request.query_params.get('limit',10)
        page_number = self.request.query_params.get('page',1)

        if slug and id:
            data = get_object_or_404(Category,slug=slug,id=id)
            Book.filter(category=data)


        paginator = Paginator(books,page_size)
        ser_data = BookSerializer(instance = paginator.page(page_number) ,many = True)
        
        context = {'data':ser_data.data,}

        return Response(context,status = 200)
