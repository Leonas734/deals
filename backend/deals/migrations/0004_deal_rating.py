# Generated by Django 3.2 on 2022-02-16 16:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('deals', '0003_comment'),
    ]

    operations = [
        migrations.AddField(
            model_name='deal',
            name='rating',
            field=models.IntegerField(default=0),
        ),
    ]
