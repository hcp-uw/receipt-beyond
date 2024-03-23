from flask_restful import Resource, reqparse, abort
from Model.receipt import receipt as modelReceipt
from flask_jwt_extended import get_jwt_identity, jwt_required
from Model.receipt import receipt

class Receipt(Resource):

    parser_post = reqparse.RequestParser()
    # parser_post.add_argument('receiptData', type=dict, required=True, help='receiptData is required')
    parser_post.add_argument('store', type=dict, required=True, help='Store is required.')
    parser_post.add_argument('date', type=str, required=True, help='Date is required.')
    parser_post.add_argument('purchases', action='append', type=dict, required=True, help='Purchases is required.')

    def __init__(self, db):
        self.db = db

    # Returns a list of all receipts of the current user.
    # If current user has no receipts, returns an empty list.
    @jwt_required()
    def get(self):
        userID = get_jwt_identity()
        try:
            user_receipts_ref = self.db.collection('Users').document(userID).collection('Receipts').get()
            user_receipts = [modelReceipt.from_dict(receipt.to_dict()).to_json() for receipt in user_receipts_ref]
            return user_receipts, 200
        except Exception as e:
            # TODO: add logging
            return {'message': 'An internal server error occurred: ' + str(e)}, 500

    # Adds a receipt to the user
    @jwt_required()
    def post(self):
        try:
            args = self.parser_post.parse_args()
            userID = get_jwt_identity()
            store = args['store']
            date = args['date']
            purchases = args['purchases']
            myReceipt = receipt.from_dict({'store':store, 'date': date, 'purchases': purchases})
            user_receipts_ref = self.db.collection('Users').document(userID).collection('Receipts')
            user_receipts_ref.add(myReceipt.to_dict())
            return {'message': 'Receipt received successfully'}, 201
        except Exception as e:
            # TODO: add logging
            return {'message': 'An internal server error occurred: ' + str(e)}, 500