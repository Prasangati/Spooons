from rest_framework import serializers
from .models import JournalEntry

class JournalEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = JournalEntry
        fields = ['entry_number', 'title', 'entry', 'created_at']
        read_only_fields = ['entry_number', 'created_at']

from rest_framework import serializers
from .models import Resource

class ResourceSerializer(serializers.ModelSerializer):
    journal_entry_date = serializers.SerializerMethodField()

    class Meta:
        model = Resource
        fields = ['id', 'name', 'description', 'link', 'journal_entry_date']

    def get_journal_entry_date(self, obj):
        return obj.journal_entry.created_at  # or obj.journal_entry.created_at if you prefer

