# Generated by Django 4.2.2 on 2023-07-03 13:39

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('agent_api', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='agent',
            old_name='tool',
            new_name='tool_url',
        ),
    ]
