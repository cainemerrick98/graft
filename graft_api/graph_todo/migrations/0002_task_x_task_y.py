# Generated by Django 5.0.7 on 2024-08-20 18:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('graph_todo', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='x',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='task',
            name='y',
            field=models.IntegerField(default=0),
        ),
    ]
