from flask import Flask
from firebase_admin import credentials, initialize_app, firestore
from flask_restful import Api
from resource.resource_receipt import ReceiptResource
from resource.resource_user import Register, Login, Logout
from resource.resource_summary import MonthlyCategoryExpenditure, MonthlySpending
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
def user_identity_lookup(user_id):
    return user_id

# Initialize Firestore database and Firestore client
cred = credentials.Certificate(app.config['FIRESTORE_KEY'])
initialize_app(cred)
db = firestore.client()

# Add resources to API
api.add_resource(ReceiptResource, '/receipt', resource_class_args=(db,))
api.add_resource(Register, '/register', resource_class_args=(db,))
api.add_resource(Login, '/login', resource_class_args=(db,))
api.add_resource(Logout, '/logout', resource_class_args=(db,))
api.add_resource(MonthlyCategoryExpenditure, '/month_cat_exp', resource_class_args=(db,))
api.add_resource(MonthlySpending, '/month_exp', resource_class_args=(db,))

# Run app
if __name__ == '__main__':
  app.run(debug=True)