from django.contrib import admin
from .models.scholarship import Scholarship
from .models.student import Student
from .models.organization import Organization
from .models.organization import Membership
from .models.category import Category

# Register your models here.

admin.site.register(Student)
admin.site.register(Scholarship)
admin.site.register(Organization)
admin.site.register(Membership)
admin.site.register(Category)
