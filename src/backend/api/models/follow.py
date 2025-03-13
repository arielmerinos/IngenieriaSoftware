from django.db import models
from .student import Student

class Follow(models.Model):
    followed = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='follow')
    follower = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='follower')
    
    def __str__(self):
        return f'{self.Student} sigue a {self.Student}'
    
    @property
    def mutual_follow(self):
        return Follow.objects.filter(followed=self.follower, follower=self.followed).exists()