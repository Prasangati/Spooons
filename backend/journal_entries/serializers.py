from rest_framework import serializers
from .models import JournalEntry, Stressors

class JournalEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = JournalEntry
        fields = ['entry_number', 'title', 'entry', 'created_at']
        read_only_fields = ['entry_number', 'created_at']

class StressorsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stressors
        fields = ['entry_number', 'title', 'description', 'created_at']
        read_only_fields = ['entry_number', 'created_at']