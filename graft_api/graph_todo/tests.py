from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import AccessToken
from graph_todo.models import Task, TaskDependency, TaskSet, User, TaskDependencyManager
from django.urls import reverse
from django.core.exceptions import ObjectDoesNotExist

class TestTaskApi(APITestCase):
    def setUp(self) -> None:    
        self.user = User.objects.create(username='user', email='user@gmail.com')
        self.user.set_password('pword')
        self.user.save()
        self.access_token = AccessToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')

        self.taskset = TaskSet.objects.create(user=self.user, name='taskset1')
        return super().setUp()
    
    def test_add_task_success(self):
        """
        a successful call to add task should return the 201
        status code and the task should be accessible in the db
        """

        data = {'title':'new_task', 'description':'this is the task', 'taskset':self.taskset.pk}
        response = self.client.post(path=reverse('task-list'), data=data, format='json')

        self.assertEqual(response.status_code, 201)

        new_task = Task.objects.all()[0]
        self.assertEqual(new_task.completed, False)
        self.assertEqual(new_task.title, data['title'])
        self.assertEqual(new_task.description, data['description'])
        self.assertEqual(new_task.taskset, self.taskset)

    def test_add_task_failure(self):
        """
        a failed call to add task should return the 400
        status code. This will happen if any of the required
        fields are blank
        """
        data = {'title':'', 'description':'blank', 'tasket':self.taskset.pk}
        response = self.client.post(path=reverse('task-list'), data=data, format='json')
        self.assertEqual(response.status_code, 400)     

    def test_get_task_fails(self):
        """
        the task api should not provide any retireve
        or list operations.
        """
        response = self.client.get(reverse('task-list'))
        self.assertEqual(response.status_code, 405)

    def test_update_task_success(self):
        """
        a successful call to update task should return 
        the 200 status code. These changes should then be 
        reflected in the db
        """
        task = Task.objects.create(taskset=self.taskset, title='task2', description='need to do')
        data = {'description':'actually not that important'}
        response = self.client.patch(reverse('task-detail', kwargs={'pk':task.pk}), data=data, format='json')

        self.assertEqual(response.status_code, 200)

        task = Task.objects.get(pk=task.pk)
        self.assertEqual(task.description, 'actually not that important')

    def test_update_task_failure(self):
        """
        a failed call to update task should return 
        the 400 status code. This will happen if required
        fields are blank
        """
        task = Task.objects.create(taskset=self.taskset, title='task2', description='need to do')
        data = {'title':''}
        response = self.client.patch(reverse('task-detail', kwargs={'pk':task.pk}), data=data, format='json')

        self.assertEqual(response.status_code, 400)

    def test_delete_task_success(self):
        """
        a successful call to delete task should return the 
        204 status code. The changes should be reflected in 
        the db - including the removal of dependencies.
        """
        task1 = Task.objects.create(taskset=self.taskset, title='Title1', description='Description1')
        task2 = Task.objects.create(taskset=self.taskset, title='Title2', description='Description2')
        dependency = TaskDependency.objects.create(parent=task1, child=task2)
        response = self.client.delete(reverse('task-detail', kwargs={'pk':task1.pk}))
        
        self.assertEqual(response.status_code, 204)
        self.assertRaises(ObjectDoesNotExist, Task.objects.get, pk=task1.pk)
        self.assertRaises(ObjectDoesNotExist, TaskDependency.objects.get, pk=dependency.pk)

class TestTaskDependencyApi(APITestCase):
    def setUp(self) -> None:
        self.user = User.objects.create(username='user', email='user@gmail.com')
        self.user.set_password('pword')
        self.user.save()
        self.access_token = AccessToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')

        self.taskset = TaskSet.objects.create(user=self.user, name='taskset1')
        self.task1 = Task.objects.create(taskset=self.taskset, title='task1', description='description1')
        self.task2 = Task.objects.create(taskset=self.taskset, title='task2', description='description2')
        return super().setUp()
    
    def test_add_dependency_success(self):
        """
        a successful call to add dependency should return the 201
        status code and the task should be accessible in the db
        """
        data = {'parent':self.task1.pk, 'child':self.task2.pk}
        response = self.client.post(reverse('dependency-list'), data=data, format='json')
        
        self.assertEqual(response.status_code, 201)

        dependencies = TaskDependency.objects.all()
        dependency = dependencies[0]

        self.assertEqual(len(dependencies), 1)
        self.assertEqual(self.task1, dependency.parent)
        self.assertEqual(self.task2, dependency.child)


    def test_add_dependency_failure(self):
        """
        a failed call to add dependency should return the 400
        status code. This will happen if any of the required
        fields are blank
        """
        data = {'parent':'', 'child':self.task2.pk}
        response = self.client.post(reverse('dependency-list'), data=data, format='json')
        
        self.assertEqual(response.status_code, 400)
    
    def test_get_dependency_fails(self):
        """
        The dependency viewset does not define any list or 
        retrieval methods
        """
        response = self.client.get(reverse('dependency-list'))
        self.assertEqual(response.status_code, 405)

    def test_delete_dependency_success(self):
        """
        a successful call to delete dependency should return the 
        202 status code. The changes should be reflected in 
        the db
        """
        dependency = TaskDependency.objects.create(parent=self.task1, child=self.task2)
        response = self.client.delete(reverse('dependency-detail', kwargs={'pk':dependency.pk}))
        
        self.assertEqual(response.status_code, 204)
        self.assertRaises(ObjectDoesNotExist, TaskDependency.objects.get, pk=dependency.pk)


    def test_manager_filter_logic(self):
        """
        the task dependency manager should make the table
        filterable by the taskset.
        """

        #create another taskset and dependency to ensure the filter works
        taskset2 = TaskSet.objects.create(user=self.user, name='taskset2')
        task3 = Task.objects.create(taskset=taskset2, title='task3', description='description3')
        task4 = Task.objects.create(taskset=taskset2, title='task3', description='description3')
        different_dependency = TaskDependency.objects.create(parent=task3, child=task4)

        #this is the dependency we expect the filter to return
        expected_dependency = TaskDependency.objects.create(parent=self.task1, child=self.task2)
        queryset = TaskDependency.objects.by_taskset(taskset=self.taskset)
        self.assertEqual(len(queryset), 1)
        self.assertEqual(queryset[0], expected_dependency)
        
class TestTaskSetApi(APITestCase):
    def setUp(self) -> None:
        self.user = User.objects.create(username='user', email='user@gmail.com')
        self.user.set_password('pword')
        self.user.save()
        self.access_token = AccessToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')

        self.taskset = TaskSet.objects.create(user=self.user, name='taskset')
        return super().setUp()
    
    def test_add_taskset_success(self):
        """
        a successful call to the add taskset should return 
        the 200 status code. The taskset should then be accessible
        in the db.
        """
        data = {'user':self.user.pk, 'name':'taskset1'}
        response = self.client.post(path=reverse('taskset-list'), data=data, format='json')
        
        self.assertEqual(response.status_code, 201)

        queryset = TaskSet.objects.all()
        new_taskset = queryset[1]

        self.assertEqual(len(queryset), 2)
        self.assertEqual(new_taskset.name, data['name'])
        self.assertEqual(new_taskset.user, self.user)

    def test_add_taskset_failure(self):
        """
        a failed call to the add taskset should return 
        the 400 status code - this will happen if the user or the
        name is blank
        """
        data = {'user':self.user.pk, 'name':''}
        response = self.client.post(path=reverse('taskset-list'), data=data, format='json')
        
        self.assertEqual(response.status_code, 400)

    def test_get_all_tasksets_success(self):
        """
        a successful to the get all tasksets api should return
        the 200 status code along with an array of all tasksets.
        """
        response = self.client.get(path=reverse('taskset-list'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

        TaskSet.objects.create(user=self.user, name='new_taskset')

        response = self.client.get(path=reverse('taskset-list'))
        self.assertEqual(len(response.data), 2)

    def test_get_taskset_success(self):
        """
        a successful call to the get taskset should return 
        the 200 status code along with all the tasks in the taskset 
        and all of the dependencies between these tasks.
        """
        #create some data to make sure it works 
        t1 = Task.objects.create(taskset=self.taskset, title='task1')
        t2 = Task.objects.create(taskset=self.taskset, title='task2')
        t3 = Task.objects.create(taskset=self.taskset, title='task3')
        TaskDependency.objects.create(parent=t1, child=t2)
        
        response = self.client.get(path=reverse('taskset-detail', kwargs={'pk':self.taskset.pk}))
        data: dict = response.data
    
        self.assertEqual(response.status_code, 200)
        self.assertListEqual(list(data.keys()), ['tasks', 'dependencies'])
        self.assertEqual(len(data['tasks']), 3)
        self.assertEqual(len(data['dependencies']), 1)

    def test_get_taskset_failure(self):
        """
        a failed call to the get taskset should return 
        the 400 status code. This will happen if the pk 
        does not exist in the taksset database.
        """
        response = self.client.get(path=reverse('taskset-detail', kwargs={'pk':999}))
        self.assertEqual(response.status_code, 404)

    def test_update_taskset_success(self):
        """
        a successful call to the update taskset api should return 
        the 200 status code. These changes should then be reflected in the db
        """
        response = self.client.patch(path=reverse('taskset-detail', kwargs={'pk': self.taskset.pk}), data={'name':'renamed_taskset'})
        self.assertEqual(response.status_code, 200)

        taskset = TaskSet.objects.get(pk=self.taskset.pk)

        self.assertEqual(taskset.name, 'renamed_taskset')



    def test_delete_taskset_success(self):
        """
        a successful call to the delet taskset api should return 
        the 202 status code. These changes should then be reflected in the db
        """
        response = self.client.delete(path=reverse('taskset-detail', kwargs={'pk': self.taskset.pk}))
        
        self.assertEqual(response.status_code, 204)
        self.assertRaises(ObjectDoesNotExist, TaskSet.objects.get, pk=self.taskset.pk)
    
