# Eliminación automática de becas expiradas

Para asegurar que las becas sean eliminadas automáticamente después de su fecha de finalización, se ha implementado un comando de gestión de Django que se puede ejecutar periódicamente mediante cron.

## Comando de gestión

El comando `expire_scholarships` verifica todas las becas cuya fecha de finalización (`end_date`) ha pasado y las elimina de la base de datos.

Para ejecutarlo manualmente:

```bash
python manage.py expire_scholarships
```

## Configuración de Cron

Para automatizar la ejecución, se recomienda agregar una entrada al crontab del servidor:

1. Editar el crontab:
   ```bash
   crontab -e
   ```

2. Agregar la siguiente línea para ejecutar diariamente a la 1 AM:
   ```bash
   0 1 * * * /path/to/IngenieriaSoftware/src/backend/clean_expired_scholarships.sh
   ```

3. Guardar y salir.

## Script de limpieza

Se proporciona un script de shell (`clean_expired_scholarships.sh`) que maneja la ejecución del comando y el registro de la actividad.

Asegúrese de:
- Actualizar la ruta del proyecto en el script
- Asignar permisos de ejecución: `chmod +x clean_expired_scholarships.sh`
- Ajustar la configuración de la ruta del entorno virtual si corresponde
