from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.base_user import BaseUserManager
from django.utils.translation import gettext_lazy as _
# Create your models here.



# Create your Custom User Manager
class CustomUserManager(BaseUserManager):
    def create_user(self, email, first_name, password=None, **extra_fields):
        if not email:
            raise ValueError(_('The Email must be set'))
        email = self.normalize_email(email)
        user = self.model(email=email, first_name=first_name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, first_name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        return self.create_user(email, first_name, password, **extra_fields)


class CustomUser(AbstractUser):
    # Remove username field
    username = None

    # Add email field with uniqueness constraint
    email = models.EmailField(_('email address'), unique=True)

    # Make first_name required
    first_name = models.CharField(_('first name'), max_length=30, blank=False)

    # Last name remains optional
    last_name = models.CharField(_('last name'), max_length=30, blank=True)

    # Set email as the username field
    USERNAME_FIELD = 'email'

    # Required fields for createsuperuser (excluding email as it's already USERNAME_FIELD)
    REQUIRED_FIELDS = ['first_name']

    objects = CustomUserManager()

    def __str__(self):
        return self.email

    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')
