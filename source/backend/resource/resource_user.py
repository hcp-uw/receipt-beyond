from flask_restful import Resource, reqparse, abort
from model.user import User
from passlib.hash import sha256_crypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.exceptions import HTTPException
from resource.resource_summary import reset_user_summary
# import logging

# Global Variables
parser = reqparse.RequestParser()
parser.add_argument('user_id', type=str, required=True, help='User id is required.')
parser.add_argument('password', type=str, required=True, help='Password is required.')
parser.add_argument('month', type=int, required=True, help='Month is required.')

# TODO: Configure logging
# logging.basicConfig(filename='app.log', level=logging.ERROR, format='%(asctime)s - %(levelname)s - %(message)s')


class Register(Resource):

    def __init__(self, db):
        self.db = db

    def post(self):
        try:
            args = parser.parse_args()
            user_id = args['user_id']
            password = args['password']
            month = args['month']
            if user_id is None or password is None:
                abort(400, message="User ID and password are required.")
            user_ref = self.db.collection('Users').document(user_id).get()
            if user_ref.exists:
                abort(409, message=f'The user ID {user_id} is already taken. Please choose different user ID.')
            user = User(user_id)
            user.hashPassword(password)
            self.db.collection('Users').document(user_id).set({'passwordHash' : user.passwordHash})
            self.db.collection('Users').document(user_id).update({'total': {}})
            self.db.collection('Users').document(user_id).update({'category': {}})
            self.db.collection('Users').document(user_id).update({'month': month})
            return {'jwt': create_access_token(identity=user_id)}, 201
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
            user_id = args['user_id']
            password = args['password']
            month = args['month']
            if user_id is None or password is None:
                abort(400, message="User id and password are required.")
            user_ref = self.db.collection('Users').document(user_id).get()
            if not user_ref.exists:
                abort(404, message="User does not exist.")
            true_password_hash = user_ref.get('passwordHash')
            if sha256_crypt.verify(password, true_password_hash):
                reset_user_summary(self.db, user_id, month)
                return {'jwt': create_access_token(identity=user_id)}, 200
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

    # TODO: add JWT token to blocklist, add the blocklist as collection in Firebase
    @jwt_required()
    def post(self):
        try:
            user = get_jwt_identity()
            raise Exception("Not implemented yet!")
        except Exception as e:
            return {'message': str(e)}, 500