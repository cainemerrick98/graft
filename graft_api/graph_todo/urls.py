from django.urls import path
from rest_framework.routers import DefaultRouter
from graph_todo.views import TaskViewSet

router = DefaultRouter()
router.register(r'task', TaskViewSet, basename='task')
urlpatterns = router.urls