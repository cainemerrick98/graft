from django.urls import path
from rest_framework.routers import DefaultRouter
from graph_todo.views import TaskViewSet, TaskDependencyViewSet, TaskSetViewSet

router = DefaultRouter()
router.register(r'task', TaskViewSet, basename='task')
router.register(r'dependency', TaskDependencyViewSet, basename='dependency')
router.register(r'taskset', TaskSetViewSet, basename='taskset')
urlpatterns = router.urls