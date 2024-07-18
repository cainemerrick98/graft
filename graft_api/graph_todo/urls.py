from django.urls import path
from rest_framework.routers import DefaultRouter
from graph_todo.views import TaskViewSet, TaskDependencyViewSet

router = DefaultRouter()
router.register(r'task', TaskViewSet, basename='task')
router.register(r'task_dependency', TaskDependencyViewSet, basename='task_dependency')
urlpatterns = router.urls