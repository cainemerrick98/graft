from rest_framework.serializers import ModelSerializer
from .models import Task, TaskDependency, TaskSet

class TaskSetSerializer(ModelSerializer):
    class Meta:
        model = TaskSet
        exclude = ['user']
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class TaskSerializer(ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'

class TaskDependencySerializer(ModelSerializer):
    class Meta:
        model = TaskDependency
        fields = '__all__'