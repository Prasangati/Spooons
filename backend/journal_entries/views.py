from rest_framework import viewsets, permissions
from .models import JournalEntry, Stressors
from .serializers import JournalEntrySerializer, StressorsSerializer
from rest_framework.decorators import action
from rest_framework.response import Response


class JournalEntryViewSet(viewsets.ModelViewSet):
    serializer_class = JournalEntrySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Return only the logged-in user's entries
        return JournalEntry.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Assign the logged-in user to the entry before saving
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def recent(self, request):
        recent_entries = self.get_queryset().order_by('-created_at')
        serializer = self.get_serializer(recent_entries, many=True)
        return Response(serializer.data)



class StressorsViewSet(viewsets.ModelViewSet):
    serializer_class = StressorsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Return only the logged-in user's entries
        return Stressors.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Assign the logged-in user to the entry before saving
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def recent(self, request):
        recent_entries = self.get_queryset().order_by('-created_at')[:5]
        serializer = self.get_serializer(recent_entries, many=True)
        return Response(serializer.data)