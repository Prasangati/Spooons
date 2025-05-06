from django.contrib import admin
from .models import JournalEntry, Stressors


admin.site.register(Stressors)
admin.site.register(JournalEntry)
# Register your models here.
