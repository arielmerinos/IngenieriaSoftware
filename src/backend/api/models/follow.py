from django.db import models
from .user import User

class Follow(models.Model):
    followed = models.ForeignKey(User, on_delete=models.CASCADE, related_name='follow')
    follower = models.ForeignKey(User, on_delete=models.CASCADE, related_name='follower')
    
    def __str__(self):
        return f'{self.user} sigue a {self.category}'
    
    @property
    def mugtual_follow(self):
        return Follow.objects.filter(followed=self.follower, follower=self.followed).exists()