
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import OrderSerializer

class OrderCreateView(APIView):
    def post(self, request):
        serializer = OrderSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save() 
            return Response({"success":True,"data":serializer.data}, status=status.HTTP_201_CREATED)
        return Response({"success":False,"error":serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
