# Generated by Django 5.1.7 on 2025-04-02 03:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_alter_membership_is_active'),
    ]

    operations = [
        migrations.AlterField(
            model_name='organization',
            name='phone_number',
            field=models.CharField(blank=True, max_length=15, null=True),
        ),
    ]
