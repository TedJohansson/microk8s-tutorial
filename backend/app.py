import json

from flask import Flask
from flask_restful import Api, Resource, reqparse
from mongoengine import StringField, Document, connect

from config import Config

application = Flask(__name__)
application.config.from_object(Config)
api = Api(application)

connect("todo", host=Config.MONGODB_URI)

class TodoEntry(Document):
    activity = StringField(max_length=100)


# Exposing our endpoint over rest api
class Todo(Resource):

    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('activity_id', type=str, required=True)
        args = parser.parse_args()

        todo_entry = TodoEntry.objects.get(id=args.get('activity_id'))
        return json.loads(todo_entry.to_json())

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('activity', type=str, required=True)
        args = parser.parse_args()

        todo_entry = TodoEntry(**args)
        todo_entry.save()
        return json.loads(todo_entry.to_json())

    def delete(self):
        parser = reqparse.RequestParser()
        parser.add_argument('activity_id', type=str, required=True)
        args = parser.parse_args()

        todo_entry = TodoEntry.objects.get(id=args.get('activity_id'))
        todo_entry.delete()

        return {'message': f"Activity {args.get('activity_id')} Deleted"}


class Todos(Resource):

    def get(self):
        todo_entries = TodoEntry.objects

        return json.loads(f'{{ "todos": {todo_entries.to_json()}}}')

api.add_resource(Todo, '/todo')
api.add_resource(Todos, '/todos')

