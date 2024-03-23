from flask import Flask
from firebase_admin import credentials, initialize_app, firestore
from flask_restful import Api
from Resource.receipt_resources import Receipt
from Resource.user_resources import Register, Login, Logout
from flask_jwt_extended import JWTManager
from config import Config
# import logging


# Initialize flask application and API
app = Flask(__name__)
app.config.from_object(Config)
api = Api(app, prefix='/api')

# logging.basicConfig(filename='app.log', level=logging.ERROR, format='%(asctime)s - %(levelname)s - %(message)s')
# app.logger.setLevel(logging.INFO)

# Initialize jwt manager
jwt = JWTManager(app)

# Define user identity loader
@jwt.user_identity_loader
def user_identity_lookup(userID):
    return userID

# Initialize Firestore database and Firestore client
cred = credentials.Certificate(app.config['FIRESTORE_KEY'])
initialize_app(cred)
db = firestore.client()

# Add resources to API
api.add_resource(Receipt, '/receipt', resource_class_args=(db,))
api.add_resource(Register, '/register', resource_class_args=(db,))
api.add_resource(Login, '/login', resource_class_args=(db,))
api.add_resource(Logout, '/logout', resource_class_args=(db,))

# Run app
if __name__ == '__main__':
  app.run(debug=True)