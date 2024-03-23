from flask import Flask, request, jsonify
from firebase_admin import credentials, firestore, initialize_app
from flask_restful import Resource, Api, reqparse, abort
from Model.receipt import receipt as modelReceipt
from Model.user import user as modelUser
import auth
from passlib.hash import sha256_crypt
from flask_httpauth import HTTPBasicAuth
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, unset_jwt_cookies
from flask import current_app

auth = HTTPBasicAuth()
cred = credentials.Certificate("Source/Backend/Database/key.json")


parser_register = reqparse.RequestParser()
parser_register.add_argument('userID', type=str, required=True, help='userID is required.')
parser_register.add_argument('password', type=str, required=True, help='password is required.')

class Register(Resource):

    def post(self):
        args = parser_register.parse_args()
        userID = args['userID']
        password = args['password']

        if userID is None or password is None:
            abort(400)

        db = firestore.client()
        user_ref = db.collection('Users').document(userID).get()
        if user_ref.exists:
            abort(404, message='UserID {} already exist.'.format(userID))
        user = modelUser(userID)
        user.hashPassword(password)
        db.collection("Users").document(userID).set({'passwordHash' : user.passwordHash})
        access_token = login_user(userID, password)
        return {'userID': user.userID, 'access_token': access_token}, 201

class Login(Resource):

    def post(self):
        args = parser_register.parse_args()
        userID = args['userID']
        password = args['password']
        if userID is None or password is None:
            abort(400)
        access_token = verify_password(userID, password)
        if access_token:
            return {'access_token': access_token}, 200
        else:
            abort(401, message='Invalid credentials')


class Logout(Resource):
    @jwt_required()
    def post(self):
        try:
            # Get the identity of the current user from the JWT token
            current_user = get_jwt_identity()

            # Perform any logout related operations here if needed
            # For example: invalidate session, revoke token, etc.

            # Clear JWT cookies from the response to logout the user
            response = jsonify({'message': 'Logged out successfully'})
            unset_jwt_cookies(response)
            return response, 200
        except Exception as e:
            return {'message': str(e)}, 500

@auth.verify_password
def verify_password(userID, password):
    try:
        db = firestore.client()
        # Reference to the document
        doc_ref = db.collection('Users').document(userID)

        # Get the document snapshot
        doc_snapshot = doc_ref.get()

        # Check if the document exists
        if doc_snapshot.exists:
            # Access the desired field from the document snapshot
            passwordHash = doc_snapshot.get('passwordHash')

            if verify_password_helper(password=password, passwordHash=passwordHash):
                # Create JWT token
                access_token = create_access_token(identity=userID)
                return access_token

        else:
            print(f"Document '{userID}' does not exist.")
            return None
    except Exception as e:
        print(f"An error occurred: {e}")
        return None
    finally:
        db.close()

def verify_password_helper(password, passwordHash):
    """
    Verifies if the provided password matches the stored password hash.
    Returns True if the password matches, False otherwise.
    """
    if passwordHash is None:
        return False  # If passwordHash is not set, return False

    return sha256_crypt.verify(password, passwordHash)

# Function to log in the user
def login_user(userID, password):
    access_token = verify_password(userID, password)
    return access_token


