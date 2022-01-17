#!/bin/sh

if [ "$DATABASE" = "postgres" ]
then
    echo "Waiting for postgres..."

    while ! nc -z $SQL_HOST $SQL_PORT; do
      sleep 0.1
    done

    echo "PostgreSQL started"
fi

python manage.py flush --no-input
python manage.py migrate
python manage.py loaddata user-seed.json
python manage.py loaddata deal-seed.json
python manage.py loaddata comment-seed.json

echo "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.create_superuser(username='admin', email='admin@myproject.com', password='password')" | python manage.py shell
echo "Superuser created"
exec "$@"