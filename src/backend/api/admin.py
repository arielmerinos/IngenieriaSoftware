from django.contrib import admin
from .models.scholarship import Scholarship
from .models.user_data import UserData
from .models.organization import Organization
from .models.organization import Membership
from .models.category import Category
from .models.type import Type
from .models.country import Country
from .models.interests import Interest
# Register your models here.

admin.site.register(UserData)
admin.site.register(Scholarship)
admin.site.register(Organization)
admin.site.register(Membership)
admin.site.register(Category)
admin.site.register(Type)
admin.site.register(Country)
admin.site.register(Interest)



