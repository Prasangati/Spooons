from rest_framework import viewsets, permissions
from .models import JournalEntry
from .serializers import JournalEntrySerializer

class JournalEntryViewSet(viewsets.ModelViewSet):
    serializer_class = JournalEntrySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Return only the logged-in user's entries
        return JournalEntry.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Assign the logged-in user to the entry before saving
        serializer.save(user=self.request.user)