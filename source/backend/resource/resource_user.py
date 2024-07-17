from datetime import datetime
from flask import Blueprint, jsonify, request
from flask_login import login_required, login_user, logout_user, current_user
from model.user import User
from google.cloud import firestore
import firebase_admin
from firebase_admin import firestore
from flask import jsonify
from passlib.hash import sha256_crypt
from model.error import *

# Initialize Firestore DB
firebase_admin.get_app()
db = firestore.client()

# Define the blueprint
auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods = ['POST'])
def login():
    data = request.get_json()
    user_id = data.get('user_id')
    password = data.get('password')
    if not user_id:
        raise MissingUserIDError()
    if not password:
        raise MissingPasswordError()
    user_ref = db.collection('Users').document(user_id).get() # checks for UserID
    if not user_ref.exists:
        user_ref = db.collection('UserEmails').document(user_id).get() # checks emails
        if not user_ref.exists:
            raise UserNotFound()
        user_id = user_ref.get('user_id')
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


# return email already exists error code 400
@auth_bp.route('/register', methods=['POST'])
def register():
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
    if db.collection('Users').document(user_id).get().exists:
        raise UserAlreadyExistsError()
    if db.collection('UserEmails').document(email).get().exists:
        raise EmailAlreadyExistsError()
    passwordHash = sha256_crypt.hash(password)
    # use set to create new document with specified data (overwrites existing documents)
    db.collection('Users').document(user_id).set({
        'passwordHash': passwordHash,
        'email': email,
        'dateJoined' : date_joined
    })
    db.collection('UserEmails').document(email).set({
        'user_id':user_id,
        'passwordHash': passwordHash
    })
    user = User(user_id)
    login_user(user)
    return jsonify({"message": f'{current_user.id} logged in successfully.'}), 200



@auth_bp.route('/user_info', methods=['GET'])
@login_required
def user_info():
    user_id = current_user.id
    user_ref = db.collection('Users').document(user_id).get()
    email = user_ref.get('email')
    date_joined = user_ref.get('dateJoined')
    return jsonify({"user_id": user_id, "email":email, "date_joined":date_joined}), 200