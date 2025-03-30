from rest_framework import serializers
from .models import JournalEntry

class JournalEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = JournalEntry
        fields = ['id', 'entry_number', 'title', 'entry', 'created_at']
        read_only_fields = ['id', 'entry_number', 'created_at']