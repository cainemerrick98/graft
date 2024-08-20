from django.db import models
from django.contrib.auth.models import User

class TaskSet(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, db_index=True)
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class Task(models.Model):
    taskset = models.ForeignKey(TaskSet, on_delete=models.CASCADE, db_index=True)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    completed = models.BooleanField(default=False)
    x = models.FloatField(default=0.0)
    y = models.FloatField(default=0.0)
    
    def __str__(self):
        return self.title

class TaskDependencyManager(models.Manager):
    def by_taskset(self, taskset:TaskSet):
        """
        filter task dependencies according to the taskset they belong
        to
        """
        return self.filter(
            models.Q(child__taskset=taskset) | models.Q(parent__taskset=taskset)
            ).distinct()

class TaskDependency(models.Model):
    child = models.ForeignKey(Task, related_name='parent_tasks', on_delete=models.CASCADE)
    parent = models.ForeignKey(Task, related_name='child_tasks', on_delete=models.CASCADE)

    objects = TaskDependencyManager()

    class Meta:
        unique_together = ('child', 'parent')

    def __str__(self):
        return f'{self.parent.title} --> {self.child.title}'    