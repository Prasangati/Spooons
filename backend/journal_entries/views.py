from rest_framework import viewsets, permissions
from .models import JournalEntry
from .serializers import JournalEntrySerializer
from rest_framework.decorators import action
from rest_framework.response import Response

from utils.gemini_helper import build_prompt, get_gemini_response  # <-- use build_prompt
from services.ai_response_service import process_ai_response  # <-- handle parsing + saving

class JournalEntryViewSet(viewsets.ModelViewSet):
    serializer_class = JournalEntrySerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'entry_number'

    def get_queryset(self):
        # Return only the logged-in user's entries
        return JournalEntry.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        entry = serializer.save(user=self.request.user)

        # Build the prompt using the helper function
        prompt = build_prompt(entry.entry)

        print(f"Prompt being sent to Gemini: {prompt}")

        try:
            # Call Gemini API and get raw response
            ai_response_text = get_gemini_response(prompt)
            print(f"Gemini AI Response: {ai_response_text}")

            # Process and save the AI response to the entry
            if ai_response_text:
                process_ai_response(entry, ai_response_text)

        except Exception as e:
            print(f"Error contacting Gemini: {e}")

    @action(detail=False, methods=['get'])
    def recent(self, request):
        recent_entries = self.get_queryset().order_by('-created_at')[:5]
        serializer = self.get_serializer(recent_entries, many=True)
        return Response(serializer.data)
