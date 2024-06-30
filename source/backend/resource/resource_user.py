from datetime import datetime
from flask import Blueprint, jsonify, abort
from flask_login import login_required, login_user, logout_user
from flask_login import login_required, login_user, logout_user, current_user
from flask_restful import reqparse, abort
from model.user import User
from werkzeug.exceptions import HTTPException
from model.user import User
from google.cloud import firestore
import firebase_admin
from firebase_admin import firestore
from flask import jsonify
from passlib.hash import sha256_crypt

# Parser for login endpoint
login_parser = reqparse.RequestParser()
login_parser.add_argument('user_id', type=str, required=True, help='User id is required.')
login_parser.add_argument('password', type=str, required=True, help='Password is required.')

# Parser for register endpoint
register_parser = reqparse.RequestParser()
register_parser.add_argument('user_id', type=str, required=True, help='User id is required.')
register_parser.add_argument('password', type=str, required=True, help='Password is required.')
register_parser.add_argument('email', type=str, required=True, help='Email is required.')

# Initialize Firestore DB
firebase_admin.get_app()
db = firestore.client()

# Define the blueprint
auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods = ['POST'])
def login():
    try:
        args = login_parser.parse_args(strict = True) # only defined arguments are accepted
        user_id = args['user_id']
        password = args['password']
        user_ref = db.collection('Users').document(user_id).get()

        if not user_ref.exists:
            return jsonify({'message': 'User not found.'}), 404

        true_password_hash = user_ref.get('passwordHash')
        if not sha256_crypt.verify(password, true_password_hash):
            return jsonify({'message': 'Invalid password, please try again.'}), 401

        user = User(user_id)
        login_user(user)
        return jsonify({"message": f'{current_user.id} logged in successfully.'}), 200

    except HTTPException as e:
        return {'message': e.description}, e.code
    except Exception as e:
        return {'message': str(e)}, 500

@auth_bp.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Logged out successfully"}), 200

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        args = register_parser.parse_args(strict = True)
        user_id = args['user_id']
        password = args['password']
        email = args['email']
        error_messages = []

        if not user_id:
            error_messages.append('Username is required.')
        else:
            if db.collection('Users').document(user_id).get().exists:
                error_messages.append('Username is already taken.')

        if not email:
            error_messages.append('Email is required.')

        if not password:
            error_messages.append('Password is required.')

        if error_messages:
            return jsonify({'messages': error_messages}), 400

        passwordHash = sha256_crypt.hash(password)
        # use set to create new document with specified data (overwrites existing documents)
        db.collection('Users').document(user_id).set({
            'passwordHash': passwordHash,
            'email': email
        })

        user = User(user_id)
        login_user(user)
        return jsonify({"message": f'{current_user.id} logged in successfully.'}), 200

    except HTTPException as e:
        return {'message': e.description}, e.code
    except Exception as e:
        return {'message': str(e)}, 500

