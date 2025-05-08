
# Register your models here.
from django.contrib import admin
from .models import Stressor, Resource, AIFeedback

admin.site.register(Stressor)
admin.site.register(Resource)
admin.site.register(AIFeedback)
