# journal/urls.py
from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import JournalEntryViewSet, StressorsViewSet, DetectedStressorViewSet, ResourceViewSet

router = DefaultRouter()
router.register(r'entries', JournalEntryViewSet, basename='journalentry')
router.register(r'stressors', StressorsViewSet, basename='stressors')
router.register(r'detected-stressors', DetectedStressorViewSet, basename='detectedstressors')
router.register(r'resources', ResourceViewSet, basename='resource')



urlpatterns = router.urls