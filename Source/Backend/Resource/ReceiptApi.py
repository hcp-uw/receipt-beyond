from flask import Flask, request, jsonify
from firebase_admin import credentials, firestore, initialize_app
from flask_restful import Resource, Api, reqparse, abort
from Model.receipt import receipt as modelReceipt
from auth import auth
from flask_jwt_extended import JWTManager, get_jwt_identity, jwt_required, create_access_token

cred = credentials.Certificate("Source/Backend/Database/key.json")

# Define the parser for validating the payload
parser_get = reqparse.RequestParser()
parser_get.add_argument('userID', type=str, required=True, help='userID is required.')

parser_post = reqparse.RequestParser()
parser_post.add_argument('userID', type=str, required=True, help='userID is required')
parser_post.add_argument('receiptData', type=dict, required=True, help='receiptData is required')


class Receipts(Resource):

    def _get_user_receipts(self, userID):
        db = firestore.client()
        user_ref = db.collection('Users').document(userID).get()
        if not user_ref.exists:
            abort(404, message='UserID {} does not exist.'.format(userID))

        user_receipts_ref = db.collection('Users').document(userID).collection('Receipts').get()
        user_data_list = [modelReceipt.from_dict(receipt.to_dict()).to_json() for receipt in user_receipts_ref]
        db.close()
        #finally close...
        return user_data_list

    # @auth.login_required

    @jwt_required()
    def get(self):
        userID = get_jwt_identity()
        #TODO: incorporate get_user_receipts
        try:
            # args = parser_get.parse_args()
            # userID = args['userID']
            user_receipts = self._get_user_receipts(userID)
            return user_receipts, 200
        except Exception as e:
            abort(400, message=str(e))

    # @auth.login_required
    @jwt_required()
    def post(self):
        try:
            args = parser_post.parse_args()
            userID = args['userID']
            receipt_data = args['receiptData']

            db = firestore.client()
            user_ref = db.collection('Users').document(userID).get()
            if not user_ref.exists:
                abort(404, message='UserID {} does not exist.'.format(userID))

            user_receipts_ref = db.collection('Users').document(userID).collection('Receipts')
            _, add_receipt_ref = user_receipts_ref.add(receipt_data)
            return {'message': 'Receipt received successfully'}, 201
        except Exception as e:
            abort(400, message=str(e))
        finally:
            db.close()