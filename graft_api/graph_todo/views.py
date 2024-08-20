from rest_framework import permissions
from rest_framework.response import Response
from graph_todo.custom_viewsets import CreateUpdateDestroyViewSet, CreateDestroyViewSet, AllMethodsViewSet
from graph_todo.models import TaskSet, Task, TaskDependency, User
from graph_todo.serializers import TaskSerializer, TaskDependencySerializer, TaskSetSerializer

class TaskSetViewSet(AllMethodsViewSet):
    """
    listing, retrieving, creating, updating, and deleting tasksets
    """
    queryset = TaskSet.objects.all()
    serializer_class = TaskSetSerializer
    permission_classes = [permissions.IsAuthenticated]

    def retrieve(self, request, *args, **kwargs):
        taskset = self.get_object()

        tasks = Task.objects.filter(taskset=taskset)
        task_serializer = TaskSerializer(tasks, many=True)
        
        dependencies = TaskDependency.objects.by_taskset(taskset)
        dependency_serializer = TaskDependencySerializer(dependencies, many=True)
        return Response({'tasks':task_serializer.data, 'dependencies':dependency_serializer.data}, 200)

class TaskViewSet(CreateUpdateDestroyViewSet):
    """
    creating, updating and deleting tasks
    """
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]


class TaskDependencyViewSet(CreateDestroyViewSet):
    """
    creating and deleting task dependencies
    """
    queryset = TaskDependency.objects.all()
    serializer_class = TaskDependencySerializer
    permission_classes = [permissions.IsAuthenticated]


