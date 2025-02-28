# Comandos django

## Crear projecto django
    django-admin startproject api .
    cd api

## Crear app django
    django-admin startapp login

## Sync database (lo que sea que signifique)

En la carpeta backend:
    python3 manage.py migrate

## Montar server

En la carpeta backend:

    python3 manage.py runserver