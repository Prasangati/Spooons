# journal/urls.py
from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import (
    JournalEntryViewSet,
    StressorsViewSet,
    DetectedStressorViewSet,
    ResourceViewSet,
    get_feedback
)

router = DefaultRouter()
router.register(r'entries', JournalEntryViewSet, basename='journalentry')
router.register(r'stressors', StressorsViewSet, basename='stressors')
router.register(r'detected-stressors', DetectedStressorViewSet, basename='detectedstressors')
router.register(r'resources', ResourceViewSet, basename='resource')

urlpatterns = [
    path('', include(router.urls)),  # this includes the ViewSets
    path('feedback/<int:entry_id>/', get_feedback),  # ✅ this adds the feedback endpoint
]
