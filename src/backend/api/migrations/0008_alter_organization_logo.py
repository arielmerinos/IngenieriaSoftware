# Generated by Django 5.2 on 2025-06-08 20:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_alter_organization_phone_number'),
    ]

    operations = [
        migrations.AlterField(
            model_name='organization',
            name='logo',
            field=models.ImageField(blank=True, help_text='Logo of the organization', null=True, upload_to='logos'),
        ),
    ]
