from datetime import datetime
from flask import Blueprint, jsonify, request
from flask_login import login_required, login_user, logout_user, current_user
from model.user import User
from flask import jsonify, current_app
from passlib.hash import sha256_crypt
from model.error import *

# Define the blueprint
auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods = ['POST'])
def login():
    db = current_app.db
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
    db = current_app.db
    user_id = current_user.id
    user_ref = db.collection('Users').document(user_id).get()
    email = user_ref.get('email')
    date_joined = user_ref.get('dateJoined')
    return jsonify({"user_id": user_id, "email":email, "date_joined":date_joined}), 200


# input json includes 'old_email', 'new_email', old_user_id', 'new_user_id'
@auth_bp.route('/change_user_info', methods=['POST'])
@login_required
def change_user_info():
    db = current_app.db
    user_id = current_user.id
    data = request.get_json()
    new_user_id = data.get('new_user_id')
    new_email = data.get('new_email')
    if new_user_id != "":
        # In Users collection: create new document with {new_user_id} loaded with old user data, then delete old {user_id} document
        # see here: https://stackoverflow.com/questions/47885921/can-i-change-the-name-of-a-document-in-firestore
        # In UserEmails collection: update {user_id} field for the corresponding email
        user_id = new_user_id
        user = User(user_id) # create a new object with the new user_id
        login_user(user) # login user using new user_id
        pass
    if new_email != "":
        # Get old {email} from {user_id} document
        # In UserEmails collection: create new document with {new_email} loaded with old {email} data, then delete old {email} document
        # In Users collection: find document {user_id} amd change the email to {new_email}
        pass


# input json includes 'old_password', 'new_password'
@auth_bp.route('/change_user_password', methods=['POST'])
@login_required
def change_user_password():
    db = current_app.db
    user_id = current_user.id
    data = request.get_json()
    old_password = data.get('old_password')
    new_password = data.get('new_password')
    # In Users collection: find current user and get the {passwordHash}. Check if the hashed {old_password} matches {passwordHash} (similar to login endpoint).
    # If not matches, raise InvalidPassword()
    # If matches, hash the {new_password} and replace old value for {passwordHash} with new value for {passwordHash} on database.
        
