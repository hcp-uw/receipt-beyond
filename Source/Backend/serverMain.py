from flask import Flask, request, jsonify
from firebase import firebase
from firebase_admin import credentials, firestore, initialize_app
import json
from datetime import datetime
from flask_restful import Resource, Api, marshal_with, fields, reqparse
from Model.receipt import receipt as modelReceipt
from Resource.ReceiptApi import Receipts
from Resource.User import Register, Login, Logout
from flask_httpauth import HTTPBasicAuth
from flask_jwt_extended import JWTManager

app = Flask(__name__)
api = Api(app)
jwt = JWTManager(app)
app.config['JWT_SECRET_KEY'] = 'jklfds2889erhk!jfl.fdm'

# Initialize Firestore DB
cred = credentials.Certificate("Source/Backend/Database/key.json")
default_app = initialize_app(cred)
db = firestore.client()

# Define your user identity loader
@jwt.user_identity_loader
def user_identity_lookup(userID):
    return userID

api.add_resource(Receipts, '/api/receipt')
api.add_resource(Register, '/api/register')
api.add_resource(Login, '/api/login')
api.add_resource(Logout, '/api/logout')

if __name__ == '__main__':
  app.run(debug=True)