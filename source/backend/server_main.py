from flask import Flask, jsonify
import firebase_admin
from firebase_admin import credentials
from config import Config
from flask_login import LoginManager
from flask_login import LoginManager, login_required, UserMixin, login_user, logout_user, current_user
from google.cloud import firestore
import firebase_admin
from firebase_admin import firestore as admin_firestore
from firebase_admin import credentials, initialize_app, firestore
from model.user import User
# Initialize LoginManager
login_manager = LoginManager()

def create_app():

  # App config
  app = Flask(__name__)
  app.config.from_object(Config)

  # Initialize firebase admin SDK app
  cred = credentials.Certificate(app.config['FIRESTORE_KEY'])
  firebase_admin.initialize_app(cred)
  db = firestore.client()

  # Flask-Login config
  login_manager.init_app(app)
  login_manager.login_view = 'auth.login'

  @login_manager.user_loader
  def load_user(user_id):
      print(user_id)
      user_ref = db.collection('Users').document(user_id).get()
      if user_ref.exists:
          user = User(user_id)
          return user
      return None

  # Import and register blueprints
  from resource.resource_user import auth_bp
  from resource.resource_receipt import receipts_bp
  from resource.resource_summary import summary_bp
  app.register_blueprint(auth_bp, url_prefix='/api')
  app.register_blueprint(receipts_bp, url_prefix='/api')
  app.register_blueprint(summary_bp, url_prefix='/api')

  return app

# Run app
if __name__ == '__main__':
  app = create_app()
  app.run(debug=True)