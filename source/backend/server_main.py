import logging
from flask import Flask
from flask_login import LoginManager
from firebase_admin import credentials, firestore, initialize_app
from config import Config
from model.error import *
from model.user import User
from resource.resource_user import auth_bp
from resource.resource_receipt import receipts_bp
from resource.resource_summary import summary_bp


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

# Add logging to show in console
console = logging.StreamHandler()
console.setLevel(logging.DEBUG)
formatter = logging.Formatter('%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]')
console.setFormatter(formatter)
logging.getLogger().addHandler(console)

# Register error handlers
error_handlers = [
    (UserAlreadyExistsError, handle_user_already_exists),
    (EmailAlreadyExistsError, handle_email_already_exists),
    (MissingUserIDError, handle_missing_user_id),
    (MissingPasswordError, handle_missing_password),
    (MissingEmailError, handle_missing_email),
    (InvalidPassword, handle_invalid_password),
    (UserNotFound, handle_user_not_found),
    (MissingReceiptTotal, handle_missing_receipt_total),
    (MissingReceiptDate, handle_missing_receipt_date),
    (InvalidDateFormat, handle_invalid_date_format),
    (MissingUserDate, handle_missing_user_date),
    (MissingReceiptImage, handle_missing_receipt_image),
    (InvalidReceiptImage, handle_invalid_receipt_image),
    (MissingNewPasswordError, handle_missing_new_password),
    (MissingNewEmail, handle_missing_new_email),
    (InvalidOldPassword, handle_invalid_old_password),
    (Exception, handle_general_error)
]

for error, handler in error_handlers:
    app.register_error_handler(error, handler)

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api')
app.register_blueprint(receipts_bp, url_prefix='/api')
app.register_blueprint(summary_bp, url_prefix='/api')

# Start Endpoint
@app.route('/')
def hello():
    return "Hello and welcome to the Receipt Plus API!"

# Initialize firebase admin SDK app
cred = credentials.Certificate(app.config['FIRESTORE_KEY'])
initialize_app(cred)
app.db = firestore.client()

# Flask-Login config
login_manager.init_app(app)
login_manager.login_view = 'auth.login'

# User loader callback for Flask-Login
@login_manager.user_loader
def load_user(user_id):
    print(user_id)
    user_ref = app.db.collection('Users').document(user_id).get()
    if user_ref.exists:
        user = User(user_id)
        return user
    return None

# Run app
if __name__ == '__main__':
  app.run(debug=True)