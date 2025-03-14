from django.db import models
from .category import Category
from .type import Type
from .country import Country
from .organization import Organization
from django.contrib.auth.models import User

class Scholarship(models.Model):
    id = models.AutoField(primary_key=True)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, null=True, blank=True, related_name='scholarships', help_text="Organization offering the scholarship")
    name = models.CharField(max_length=250, help_text="Name of the scholarship")
    publication_date = models.DateField(auto_now_add=True, help_text="Date when the scholarship was published")
    start_date = models.DateField(help_text="Start date of the scholarship")
    end_date = models.DateField(help_text="End date of the scholarship")
    type = models.ManyToManyField(Type, related_name='scholarship_types', related_query_name='scholarship_type', help_text="Type of the scholarship")
    image = models.ImageField(upload_to='scholarships', null=True, blank=True, help_text="Image related to the scholarship")
    content = models.TextField(help_text="Description of the scholarship")
    categories = models.ManyToManyField(Category, related_name='scholarship_categories', related_query_name='scholarship_category', help_text="Categories describing the scholarship")
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_scholarships', help_text="User who created the scholarship")
    country = models.ManyToManyField(Country, related_name='scholarship_countries', related_query_name='scholarship_country', help_text="Country where the scholarship is offered")

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Scholarship"
        verbose_name_plural = "Scholarships"