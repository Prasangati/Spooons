# journal/urls.py
from rest_framework.routers import DefaultRouter
from .views import JournalEntryViewSet

router = DefaultRouter()
router.register(r'entries', JournalEntryViewSet, basename='journalentry')

urlpatterns = router.urls


from rest_framework.routers import DefaultRouter
from .views import JournalEntryViewSet, ResourceViewSet

router = DefaultRouter()
router.register(r'entries', JournalEntryViewSet, basename='journalentry')
router.register(r'resources', ResourceViewSet, basename='resource')

urlpatterns = router.urls
