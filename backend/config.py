import os

class Config:
    JWT_SECRET_KEY = os.environ.get('SECRET_KEY', 'You-will-never-get-this')
    MONGODB_URI = os.environ.get('MONGODB_URI', 'mongodb://mongodb')

