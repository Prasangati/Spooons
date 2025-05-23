# Generated by Django 5.1.6 on 2025-05-19 23:55

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('journal_entries', '0006_detectedstressor_tags'),
    ]

    operations = [
        migrations.CreateModel(
            name='AIFeedback',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('feedback', models.TextField()),
                ('journal_entry', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='ai_feedback', to='journal_entries.journalentry')),
            ],
        ),
        migrations.CreateModel(
            name='Resource',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('link', models.URLField()),
                ('journal_entry', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='resources', to='journal_entries.journalentry')),
            ],
        ),
    ]
