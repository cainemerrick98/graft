from rest_framework.serializers import ModelSerializer
from .models import Task, TaskDependency, TaskSet

class TaskSerializer(ModelSerializer):
    class Meta:
        model = Task
        fields = ['title', 'description', 'taskset']