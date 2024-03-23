from flask_restful import Resource, reqparse, abort
from Model.user import user as model_user
from passlib.hash import sha256_crypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.exceptions import HTTPException
# import logging

# Global Variables
parser = reqparse.RequestParser()
parser.add_argument('userID', type=str, required=True, help='userID is required.')
parser.add_argument('password', type=str, required=True, help='password is required.')

# TODO: Configure logging
# logging.basicConfig(filename='app.log', level=logging.ERROR, format='%(asctime)s - %(levelname)s - %(message)s')

class Register(Resource):

    def __init__(self, db):
        self.db = db

    def post(self):
        try:
            args = parser.parse_args()
            userID = args['userID']
            password = args['password']
            if userID is None or password is None:
                abort(400, message="User ID and password are required.")
            user_ref = self.db.collection('Users').document(userID).get()
            if user_ref.exists:
                abort(409, message=f'The user ID {userID} is already taken. Please choose different user ID.')
            user = model_user(userID)
            user.hashPassword(password)
            self.db.collection("Users").document(userID).set({'passwordHash' : user.passwordHash})
            return {'jwt': create_access_token(identity=userID)}, 201
        except HTTPException as e:
            # TODO: add logging
            return e.data, e.code
        except Exception as e:
            return {'message': 'An internal server error occurred.'}, 500
            #TODO:  add logging

class Login(Resource):

    def __init__(self, db):
        self.db = db

    def post(self):
        try:
            args = parser.parse_args()
            userID = args['userID']
            password = args['password']
            if userID is None or password is None:
                abort(400, message="userID and password are required.")
            user_ref = self.db.collection('Users').document(userID).get()
            if not user_ref.exists:
                abort(404, message="User does not exist.")
            true_password_hash = user_ref.get('passwordHash')
            if sha256_crypt.verify(password, true_password_hash):
                return {'jwt': create_access_token(identity=userID)}, 200
            else:
                abort(401, message="Invalid password, please try again.")
        except HTTPException as e:
            # TODO: add logging
            return e.data, e.code
        except Exception as e:
            return {'message': 'An internal server error occurred.'}, 500
            #TODO:  add logging

class Logout(Resource):

    def __init__(self, db):
        self.db = db

    # TODO: add JWT token to blocklist
    @jwt_required()
    def post(self):
        try:
            user = get_jwt_identity()
            raise Exception("Not implemented yet!")
        except Exception as e:
            return {'message': str(e)}, 500