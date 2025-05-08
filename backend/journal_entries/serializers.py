from rest_framework import serializers
from taggit.serializers import (TaggitSerializer, TagListSerializerField)
from .models import JournalEntry

class JournalEntrySerializer(TaggitSerializer, serializers.ModelSerializer):
    tags = TagListSerializerField()
    entry = serializers.CharField(max_length=500)  #  limit entry char

       

    class Meta:
        model = JournalEntry
        fields = ['entry_number', 'title', 'entry', 'created_at', 'tags']
        read_only_fields = ['entry_number', 'created_at']