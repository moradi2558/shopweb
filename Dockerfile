FROM python:3.10-slim

WORKDIR /shopweb

COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app/

CMD ["sh", "-c", "python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]

