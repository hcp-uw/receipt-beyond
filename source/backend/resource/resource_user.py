from datetime import datetime
from flask import Blueprint, jsonify, request
from flask_login import login_required, login_user, logout_user, current_user
from model.user import User
from flask import jsonify, current_app
from passlib.hash import sha256_crypt
from model.error import *

# Define the blueprint
auth_bp = Blueprint('auth', __name__)

### Delete email collection, no dependencies (duplicate data editing, causes consistency issues)
### check user_id and email, shouldn't be too much more expensive since
### subcollections don't automatically load
@auth_bp.route('/login', methods = ['POST'])
def login():
    db = current_app.db
    data = request.get_json()
    user_id = data.get('user_id') # either user_id or email
    password = data.get('password')
    if not user_id:
        raise MissingUserIDError()
    if not password:
        raise MissingPasswordError()
    user_ref = db.collection('Users').document(user_id).get()
    if not user_ref.exists:
        raise UserNotFound()
    true_password_hash = user_ref.get('passwordHash')
    if not sha256_crypt.verify(password, true_password_hash):
        raise InvalidPassword()
    user = User(user_id)
    login_user(user)
    return jsonify({"message": f'{current_user.id} logged in successfully.'}), 200


@auth_bp.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Logged out successfully"}), 200

# Register, Login, and new month should not cause error (in front end). For new month, if doesn't exist,
# frontend has a way of dealing with it.
@auth_bp.route('/register', methods=['POST'])
def register():
    db = current_app.db
    data = request.get_json()
    user_id = data.get('user_id')
    password = data.get('password')
    email = data.get('email')
    date_joined = data.get('date')
    if not user_id:
        raise MissingUserIDError()
    if not password:
        raise MissingPasswordError()
    if not email:
        raise MissingEmailError()
    if not date_joined:
        raise MissingUserDate()
    try:
        date = datetime.strptime(date_joined, '%Y-%m-%d')
    except:
        raise InvalidDateFormat()
    users_ref = db.collection('Users')
    docs = users_ref.stream()
    user_id_already_exists = False
    user_email_already_exists = False
    for doc in docs:
        existing_user_id = doc.id
        existing_email = doc.get('email')
        if user_id == existing_user_id:
            user_id_already_exists = True
            break # break out early because user_id exists is priority error
        if email == existing_email:
            user_email_already_exists = True
    if user_id_already_exists:
        raise UserAlreadyExistsError() 
    if user_email_already_exists:
        raise EmailAlreadyExistsError()
    passwordHash = sha256_crypt.hash(password)
    # use set to create new document with specified data (overwrites existing documents)
    db.collection('Users').document(user_id).set({
        'passwordHash': passwordHash,
        'email': email,
        'dateJoined' : date_joined
    })
    user = User(user_id)
    login_user(user)
    return jsonify({"message": f'{current_user.id} logged in successfully.'}), 200

def get_user_info(user_id):
    db = current_app.db
    user_ref = db.collection('Users').document(user_id).get()
    email = user_ref.get('email')
    date_joined = user_ref.get('dateJoined')
    return jsonify({"user_id": user_id, "email":email, "date_joined":date_joined})

@auth_bp.route('/user_info', methods=['GET'])
@login_required
def user_info():
    return get_user_info(current_user.id), 200

### Resource for changing an email
# input json includes 'new_email'
@auth_bp.route('/change_user_email', methods=['POST'])
@login_required
def change_user_email():
    db = current_app.db
    user_id = current_user.id
    data = request.get_json()
    new_email = data.get('new_email')
    if not new_email:
        raise MissingNewEmail()
    if new_email != "":
        db.collection('Users').document(user_id).update({
            'email': new_email,
        })
    return jsonify({"message": "Email changed successfully."}), 201

# input json includes 'current_password', 'new_password'
@auth_bp.route('/change_user_password', methods=['POST'])
@login_required
def change_user_password():
    db = current_app.db
    user_id = current_user.id
    data = request.get_json()
    current_password = data.get('current_password')
    new_password = data.get('new_password')
    user_doc = db.collection('Users').document(user_id).get()
    if not current_password:
        raise MissingPasswordError()
    if not new_password:
        raise MissingNewPasswordError()
    true_password_hash = user_doc.get('passwordHash')
    if not sha256_crypt.verify(current_password, true_password_hash):
        raise InvalidOldPassword() 
    newPasswordHash = sha256_crypt.hash(new_password)
    db.collection('Users').document(user_id).update({
        'passwordHash': newPasswordHash,
    })
    return jsonify({"message": 'Password changed successfully.'}), 201
   
        
### FUTURE TODO: Reset password functionality