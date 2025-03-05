Existe la app "api" dentro del proyecto "impulsaFuturo".

Para ejecutar se necesita (en la carpeta backend):

    python3 manage.py makemigrations

    python3 manage.py migrate

    python3 manage.py runserver

Ejemplo regsitro:

- POST

- http://127.0.0.1:8000/api/register/

- Body:
```JSON
{
    "correo": "correo1233@correo.com",
    "contrasena": "test",
    "primerNombre": "A",
    "segundoNombre": "B",
    "primerApellido": "C",
    "segundoApellido": "D",
    "telefono": "#bfduhd",
    "fechaNac": "2006-10-25"
}
```