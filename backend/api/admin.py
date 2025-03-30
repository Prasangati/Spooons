from django.contrib.auth.admin import UserAdmin
from django.contrib import admin
from api.models import CustomUser
from journal_entries.models import JournalEntry
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin



class UserAdmin(BaseUserAdmin):
    ordering = ('email',)



admin.site.register(CustomUser, UserAdmin)
admin.site.register(JournalEntry)
