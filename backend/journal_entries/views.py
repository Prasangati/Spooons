from rest_framework import viewsets, permissions
from .models import JournalEntry, Stressors, DetectedStressor
from .serializers import JournalEntrySerializer, StressorsSerializer, DetectedStressorSerializer
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
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


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def recent_detected_stressors(request):
    user = request.user
    stressors = DetectedStressor.objects.filter(user=user, added=False).order_by('-created_at')
    serializer = DetectedStressorSerializer(stressors, many=True)
    return Response(serializer.data)