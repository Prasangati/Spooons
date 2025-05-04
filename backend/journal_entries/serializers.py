from rest_framework import serializers
from taggit.serializers import (TaggitSerializer, TagListSerializerField)
from .models import JournalEntry

class JournalEntrySerializer(TaggitSerializer, serializers.ModelSerializer):
    tags = TagListSerializerField()
       

    class Meta:
        model = JournalEntry
        fields = ['entry_number', 'title', 'entry', 'created_at', 'tags']
        read_only_fields = ['entry_number', 'created_at']