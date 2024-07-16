from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.urls import reverse

# Create your tests here.
class TestAuthApi(APITestCase):

    def setUp(self) -> None:
        self.register_url = reverse('register')
        self.login_url = reverse('login')

        User.objects.create_user(
            username='user2',
            password='Cheese123',
            email='user2@gmail.com'
        )
        return super().setUp()
    
    def test_register_success(self):
        """
        A successful call to register a user should return a response code 
        of 201. The user should be saved to and accessible from user database. 
        """
        data = {'username':'user1', 'password':'Abc123', 'email':'user1@gmail.com'}
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, 201)
        
        userset = User.objects.all()
        self.assertEqual(len(userset), 2)

        new_user = userset[1]
        self.assertEqual(new_user.username, data['username'])
        self.assertEqual(new_user.email, data['email'])

    def test_register_failure(self):
        """
        A call to register api will fail if the username or password field 
        is blank
        """
        data_nousername = {'username':'', 'password':'Abc123', 'email':'user1@gmail.com'}
        response_nousername = self.client.post(self.register_url, data_nousername, format='json')
        self.assertEqual(response_nousername.status_code, 400)

        data_nopassword = {'username':'user1', 'password':'', 'email':'user1@gmail.com'}
        response_nopassword = self.client.post(self.register_url, data_nopassword, format='json')
        self.assertEqual(response_nopassword.status_code, 400)

    def test_login_success(self):
        """
        A successful login attempt should return a 200 status code
        with a refresh and an access token.
        """
        data = {'username':'user2', 'password':'Cheese123'}
        response = self.client.post(reverse('login'), data=data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertTrue('access' in response.data)
        self.assertTrue('refresh' in response.data)

    def test_login_failure(self):
        """
        A failed login attempt should return a 401 status code and a msg stating 
        'invalid credentials'
        """
        data = {'username':'user2', 'password':'Cheese'}
        response = self.client.post(reverse('login'), data=data, format='json')
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.data['msg'], 'invalid credentials')

