# journal/urls.py
from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import JournalEntryViewSet, StressorsViewSet, DetectedStressorViewSet

router = DefaultRouter()
router.register(r'entries', JournalEntryViewSet, basename='journalentry')
router.register(r'stressors', StressorsViewSet, basename='stressors')
router.register(r'detected-stressors', DetectedStressorViewSet, basename='detectedstressors')



urlpatterns = router.urls