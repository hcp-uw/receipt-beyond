from flask import Flask
import firebase_admin
from config import Config
from flask_login import LoginManager
from google.cloud import firestore
from firebase_admin import credentials, firestore
from model.error import *
from model.user import User
import logging

def create_app():
  # Initialize LoginManager
  login_manager = LoginManager()
  # App config
  app = Flask(__name__)
  app.config.from_object(Config)
  # Set up logging configuration
  logging.basicConfig(
    filename='app.log',  # Log file name
    level=logging.ERROR,  # Log level
    format='%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'  # Log format
  )
  # Register error handlers
  app.register_error_handler(UserAlreadyExistsError, handle_user_already_exists)
  app.register_error_handler(EmailAlreadyExistsError, handle_email_already_exists)
  app.register_error_handler(MissingUserIDError, handle_missing_user_id)
  app.register_error_handler(MissingPasswordError, handle_missing_password)
  app.register_error_handler(MissingEmailError, handle_missing_email)
  app.register_error_handler(InvalidPassword, handle_invalid_password)
  app.register_error_handler(UserNotFound, handle_user_not_found)
  app.register_error_handler(MissingReceiptTotal, handle_missing_receipt_total)
  app.register_error_handler(MissingReceiptDate, handle_missing_receipt_date)
  app.register_error_handler(InvalidDateFormat, handle_invalid_date_format)
  app.register_error_handler(MissingUserDate, handle_missing_user_date)
  app.register_error_handler(Exception, handle_general_error)
  # Initialize firebase admin SDK app
  cred = credentials.Certificate(app.config['FIRESTORE_KEY'])
  firebase_admin.initialize_app(cred)
  db = firestore.client()
  # Flask-Login config
  login_manager.init_app(app)
  login_manager.login_view = 'auth.login'
  # load_user
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