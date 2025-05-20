from rest_framework import serializers
from taggit.serializers import (TaggitSerializer, TagListSerializerField)
from .models import JournalEntry, Stressors, DetectedStressor


class JournalEntrySerializer(TaggitSerializer, serializers.ModelSerializer):
    tags = TagListSerializerField()
    entry = serializers.CharField(max_length=500)  #  limit entry char
    class Meta:
        model = JournalEntry
        fields = ['id','entry_number', 'title', 'entry', 'created_at', 'tags']
        read_only_fields = ['entry_number', 'created_at']

class StressorsSerializer(serializers.ModelSerializer):
    tags = TagListSerializerField()
    class Meta:
        model = Stressors
        fields = ['id','entry_number', 'title', 'description', 'created_at', 'tags']
        read_only_fields = ['entry_number', 'created_at']


class DetectedStressorSerializer(serializers.ModelSerializer):
    tags = TagListSerializerField()
    class Meta:
        model = DetectedStressor
        fields = ['id', 'title', 'description', 'created_at', 'entry', 'added', 'tags']


from rest_framework import serializers
from .models import Resource

class ResourceSerializer(serializers.ModelSerializer):
    journal_entry_date = serializers.SerializerMethodField()

    class Meta:
        model = Resource
        fields = ['id', 'name', 'description', 'link', 'journal_entry_date']

    def get_journal_entry_date(self, obj):
        return obj.journal_entry.created_at