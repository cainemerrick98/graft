# Generated by Django 5.0.7 on 2024-08-20 20:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('graph_todo', '0002_task_x_task_y'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='x',
            field=models.FloatField(default=0.0),
        ),
        migrations.AlterField(
            model_name='task',
            name='y',
            field=models.FloatField(default=0.0),
        ),
    ]
