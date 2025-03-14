from django.urls import path
from . import views

urlpatterns = [
    path('user/', views.UserDataListView.as_view()),
    path('organizations/', views.OrganizationListView.as_view()),
    path('scholarships/', views.ScholarshipListView.as_view(), name='scholarship-list'),
    path('categories/', views.CategoryListView.as_view()),
    # path('organizations/<int:pk>/', views.OrganizationDetail.as_view()),
    # path('students/<int:pk>/', views.StudentDetail.as_view()),
    # path('scholarships/<int:pk>/', views.ScholarshipDetail.as_view()),
]