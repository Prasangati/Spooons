from django.db import models
from django.utils import timezone
from django.db import transaction
from django.conf import settings

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