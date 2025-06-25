from django.urls import path
from .views import *

urlpatterns = [
    path("addOrder/",OrderCreateView.as_view()),
]
