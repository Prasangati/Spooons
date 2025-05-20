from rest_framework import viewsets, permissions
from .models import JournalEntry, Stressors, DetectedStressor
from .serializers import JournalEntrySerializer, StressorsSerializer, DetectedStressorSerializer
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from utils.gemini_helper import build_prompt, get_gemini_response
from services.ai_response_service import process_ai_response

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

    @action(detail=False, methods=['delete'], url_path='by-entry-number/(?P<entry_number>[^/.]+)')
    def delete_by_entry_number(self, request, entry_number=None):
        entry = get_object_or_404(
            self.get_queryset(),
            entry_number=entry_number,
            user=request.user
        )
        print(entry)
        entry.delete()
        return Response({'status': 'Deleted by entry_number'}, status=status.HTTP_204_NO_CONTENT)




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


class DetectedStressorViewSet(viewsets.ModelViewSet):
    queryset = DetectedStressor.objects.all()
    serializer_class = DetectedStressorSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Limit all actions to the authenticated user's stressors
        return DetectedStressor.objects.filter(user=self.request.user)

    @action(detail=False, methods=['get'], url_path='recent')
    def recent(self, request):
        # Only return unadded recent stressors
        stressors = self.get_queryset().filter(added=False).order_by('-created_at')
        serializer = self.get_serializer(stressors, many=True)
        return Response(serializer.data)



    @action(detail=True, methods=['post'], url_path='accept')
    def accept(self, request, pk=None):
        detected = get_object_or_404(self.get_queryset(), pk=pk)

        # Prevent duplicates if already accepted
        if detected.added:
            return Response({'detail': 'Already added.'}, status=status.HTTP_400_BAD_REQUEST)

        # Create the confirmed stressor
        Stressors.objects.create(
            user=detected.user,
            title=detected.title,
            description=detected.description
        )

        # Mark detected stressor as added
        detected.added = True
        detected.save()

        return Response({'status': 'Stressor added successfully'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], url_path='dismiss')
    def dismiss(self, request, pk=None):
        detected = get_object_or_404(self.get_queryset(), pk=pk)

        # Prevent duplicates if already accepted
        if detected.added:
            return Response({'detail': 'Already added.'}, status=status.HTTP_400_BAD_REQUEST)


        # Mark detected stressor as added
        detected.added = True
        detected.save()

        return Response({'status': 'Stressor rejected successfully'}, status=status.HTTP_200_OK)