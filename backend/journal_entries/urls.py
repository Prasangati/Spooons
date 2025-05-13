# journal/urls.py
from rest_framework.routers import DefaultRouter
from .views import JournalEntryViewSet, StressorsViewSet, recent_detected_stressors

router = DefaultRouter()
router.register(r'entries', JournalEntryViewSet, basename='journalentry')
router.register(r'stressors', StressorsViewSet, basename='stressors')



urlpatterns = router.urls + [
    path('detected-stressors/recent/', recent_detected_stressors),
]
