from django.db import models
from django.utils import timezone
from django.db import transaction
from django.conf import settings
from taggit.managers import TaggableManager

class JournalEntry(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='journal_entries'
    )
    entry_number = models.PositiveIntegerField(null=True, editable=False)
    title = models.CharField(max_length=200)
    entry = models.TextField()
    created_at = models.DateTimeField(default=timezone.now, db_index=True)
    tags = TaggableManager()

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'Journal Entries'
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'entry_number'],
                name='unique_user_entry'
            )
        ]

    def __str__(self):
        return f"{self.title} - {self.created_at.strftime('%Y-%m-%d %H:%M')}"

    def save(self, *args, **kwargs):
        if not self.pk:  # New entry only
            with transaction.atomic():
                # Get latest entry number for this user
                last = JournalEntry.objects.filter(
                    user=self.user
                ).select_for_update().order_by('-entry_number').first()
                self.entry_number = last.entry_number + 1 if last else 1
        super().save(*args, **kwargs)
        from utils.gemini_helper import generate_ai_stressors
        generate_ai_stressors(self)


class Stressors(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='stressors'
    )
    entry_number = models.PositiveIntegerField(null=True, editable=False)
    title = models.CharField(max_length=200)
    description = models.TextField()
    created_at = models.DateTimeField(default=timezone.now, db_index=True)
    tags = TaggableManager()

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'Stressors'
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'entry_number'],
                name='unique_stressor_entry'
            )
        ]

    def __str__(self):
        return f"{self.title} - {self.created_at.strftime('%Y-%m-%d %H:%M')}"

    def save(self, *args, **kwargs):
        if not self.pk:
            with transaction.atomic():
                last = Stressors.objects.filter(
                    user=self.user
                ).select_for_update().order_by('-entry_number').first()
                self.entry_number = last.entry_number + 1 if last else 1
        super().save(*args, **kwargs)



class DetectedStressor(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='detected_stressors'
    )
    entry = models.ForeignKey(
        'JournalEntry',
        on_delete=models.CASCADE,
        related_name='detected_stressors'
    )
    title = models.CharField(max_length=200)
    tags = TaggableManager()
    description = models.TextField(default='')
    added = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now, db_index=True)

    class Meta:
        ordering = ['-created_at']
        unique_together = ('user', 'entry', 'title')  # prevent duplicates

    def __str__(self):
        return f"[{'✔' if self.added else '✖'}] {self.title} (from Entry #{self.entry.entry_number})"




class Resource(models.Model):
    journal_entry = models.ForeignKey(
        JournalEntry,
        on_delete=models.CASCADE,
        related_name='resources'
    )
    name = models.CharField(max_length=255)
    description = models.TextField()
    link = models.URLField()



class AIFeedback(models.Model):
    journal_entry = models.OneToOneField(
        'JournalEntry',
        on_delete=models.CASCADE,
        related_name='ai_feedback'
    )
    feedback = models.TextField()

    def __str__(self):
        return f"Feedback for Entry #{self.journal_entry.id}"