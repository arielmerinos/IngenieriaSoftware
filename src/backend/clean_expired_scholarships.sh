#!/bin/bash
# Script to clean expired scholarships
# This script should be run periodically with a cron job
# Example: 0 1 * * * /path/to/clean_expired_scholarships.sh

# Path to your project
PROJECT_DIR="/path/to/IngenieriaSoftware/src/backend"

# Switch to the project directory
cd $PROJECT_DIR

# Activate virtual environment (if using one)
# source /path/to/venv/bin/activate

# Run the management command
python manage.py expire_scholarships

# Log the execution
echo "Executed expired scholarships cleanup at $(date)" >> /var/log/scholarship_cleanup.log
