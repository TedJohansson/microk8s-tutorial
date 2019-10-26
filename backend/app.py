import contextlib
import json
import logging
import socket

import statsd
from flask import Flask
from flask_restful import Api, Resource, reqparse
from mongoengine import StringField, Document, connect

from config import Config

application = Flask(__name__)
application.config.from_object(Config)
api = Api(application)

logging.basicConfig(level='INFO')

connect("todo", host=Config.MONGODB_URI)

try:
    statsd_client = statsd.StatsClient('graphite', 8125)
except socket.gaierror:
    statsd_client = None
    logging.warning("statsd client not found")


def log_statsd(item):
    if statsd_client:
        statsd_client.incr(item)
    else:
        logging.info(item)


def log_time(item):
    if statsd_client:
        return statsd_client.timer(item)
    else:
        return contextlib.suppress()


class TodoEntry(Document):
    activity = StringField(max_length=100)


# Exposing our endpoint over rest api
class Todo(Resource):

    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('activity_id', type=str, required=True)
        args = parser.parse_args()

        todo_entry = TodoEntry.objects.get(id=args.get('activity_id'))
        log_statsd('get')
        return json.loads(todo_entry.to_json())

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('activity', type=str, required=True)
        args = parser.parse_args()

        todo_entry = TodoEntry(**args)
        todo_entry.save()
        log_statsd('save')
        return json.loads(todo_entry.to_json())

    def delete(self):
        parser = reqparse.RequestParser()
        parser.add_argument('activity_id', type=str, required=True)
        args = parser.parse_args()

        todo_entry = TodoEntry.objects.get(id=args.get('activity_id'))
        todo_entry.delete()

        log_statsd('delete')
        return {'message': f"Activity {args.get('activity_id')} Deleted"}


class Todos(Resource):

    def get(self):
        with log_time('list'):
            todo_entries = TodoEntry.objects

            log_statsd('list')
            return json.loads(f'{{ "todos": {todo_entries.to_json()}}}')

api.add_resource(Todo, '/todo')
api.add_resource(Todos, '/todos')

