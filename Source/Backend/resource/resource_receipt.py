from datetime import datetime
from flask_restful import Resource, reqparse, abort
from model.receipt import Receipt
from flask_jwt_extended import get_jwt_identity, jwt_required

class ReceiptResource(Resource):

    parser_post = reqparse.RequestParser()
    parser_post.add_argument('store', type=dict, required=True, help='Store is required.')
    parser_post.add_argument('date', type=str, required=True, help='Date is required.')
    parser_post.add_argument('purchases', action='append', type=dict, required=True, help='Purchases is required.') # use append for a list of objects
    parser_post.add_argument('category', type=str, required=True, help='Category is required.')
    parser_post.add_argument('total', type=int, required=True, help='Total is required.')

    def __init__(self, db):
        self.db = db

    # Returns a list of all receipts of the current user.
    # If current user has no receipts, returns an empty list.
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        try:
            user_receipts_ref = self.db.collection('Users').document(user_id).collection('Receipts').get()
            user_receipts = []
            for receipt in user_receipts_ref:
                receipt_data = Receipt.from_dict(receipt.to_dict()).to_dict()
                receipt_data['id'] = receipt.id
                user_receipts.append(receipt_data)
            return user_receipts, 200
        except Exception as e:
            # TODO: add logging
            return {'message': 'An internal server error occurred: ' + str(e)}, 500

    # Adds a receipt to the user
    @jwt_required()
    def post(self):
        try:
            args = self.parser_post.parse_args()
            user_id = get_jwt_identity()
            myReceipt = Receipt.from_dict(args).to_dict()
            myReceipt['date'] = datetime.strptime(myReceipt['date'], '%Y-%m-%d')
            user_receipts_ref = self.db.collection('Users').document(user_id).collection('Receipts')
            user_receipts_ref.add(myReceipt)
            return {'message': 'Receipt received successfully'}, 201
        except Exception as e:
            # TODO: add logging
            return {'message': 'An internal server error occurred: ' + str(e)}, 500

    #TODO: add a put endpoint for when the user edits receipts. Make sure to roll changes over to resource_summary

    #TODO: add a delete endpoint for when the user deletes a receipt.