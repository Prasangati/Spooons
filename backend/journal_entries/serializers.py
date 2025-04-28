from rest_framework import serializers
from .models import JournalEntry

class JournalEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = JournalEntry
        fields = ['entry_number', 'title', 'entry', 'created_at']
        read_only_fields = ['entry_number', 'created_at']