from rest_framework import permissions
from graph_todo.custom_viewsets import CreateUpdateDestroyViewSet
from graph_todo.models import TaskSet, Task, TaskDependency, User
from graph_todo.serializers import TaskSerializer

# Create your views here.
class TaskViewSet(CreateUpdateDestroyViewSet):
    """
    creating, updating and deleting tasks
    """
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]



