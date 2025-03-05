from django.db import models
from django.contrib.auth.models import AbstractBaseUser,PermissionsMixin,BaseUserManager

class UserManager(BaseUserManager):
    
    def _create_user(
            self,
            correo,
            contrasena,
            primerNombre,
            segundoNombre,
            primerApellido,
            segundoApellido,
            telefono,
            fechaNac):
        if not correo:
            raise ValueError("Email must be provided")
        if not contrasena:
            raise ValueError("Password must be provided")
        
        user = self.model(
            correo = self.normalize_email(correo),
            primerNombre = primerNombre,
            segundoNombre = segundoNombre,
            primerApellido = primerApellido,
            segundoApellido = segundoApellido,
            telefono = telefono,
            fechaNac = fechaNac
        )

        user.set_password(contrasena)
        user.save(using=self._db)
        return user


class User(AbstractBaseUser, PermissionsMixin):
    TAMANO_MAXIMO = 255 # Provisional
    #  Abstractbaseuser has password, last_login, is_active by default
    correo = models.EmailField(db_index=True, unique=True)
    primerNombre = models.CharField(max_length=TAMANO_MAXIMO)
    segundoNombre = models.CharField(max_length=TAMANO_MAXIMO)
    primerApellido = models.CharField(max_length=TAMANO_MAXIMO)
    segundoApellido = models.CharField(max_length=TAMANO_MAXIMO)
    telefono = models.CharField(max_length=TAMANO_MAXIMO) # Existe una lib... biblioteca "django-phonenumber-field"
    fechaNac = models.DateField()

    # Omitimos lo de django admin

    USERNAME_FIELD = 'correo'
    REQUIRED_FIELDS = [
        'primerNombre',
        'segundoNombre',
        'primerApellido',
        'segundoApellido'
        'telefono',
        'fechaNac'
    ]

    objects = UserManager()