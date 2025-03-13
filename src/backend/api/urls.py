from django.urls import path
from . import views

urlpatterns = [
    path('students/', views.StudentListView.as_view()),
    # path('students/<int:pk>/', views.StudentDetail.as_view()),
    # path('organizations/', views.OrganizationList.as_view()),
    # path('organizations/<int:pk>/', views.OrganizationDetail.as_view()),
    path('scholarships/', views.ScholarshipListView.as_view(), name='scholarship-list'),
    # path('scholarships/<int:pk>/', views.ScholarshipDetail.as_view()),
    # path('follow/', views.FollowList.as_view()),
    # path('follow/<int:pk>/', views.FollowDetail.as_view()),
    # path('notifications/', views.NotificationList.as_view()),
    # path('notifications/<int:pk>/', views.NotificationDetail.as_view()),
]