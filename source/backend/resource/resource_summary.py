from flask_restful import Resource, reqparse, abort
from model.receipt import Receipt
from flask_jwt_extended import get_jwt_identity, jwt_required
from werkzeug.exceptions import HTTPException

### TODO: what if field does not exist in database, return none...
parser = reqparse.RequestParser()
parser.add_argument('month', type=int, required=True, help='Month is required.')

def reset_user_summary(db, user_id, month):
    user_ref = db.collection('Users').document(user_id)
    user = user_ref.get()
    if user.exists:
        user_data = user.to_dict()
        db_month = user_data['month']
        if (month!=db_month):
            db.collection('Users').document(user_id).update({'total': {}})
            db.collection('Users').document(user_id).update({'category': {}})
            db.collection('Users').document(user_id).update({'month': month})


class MonthlySpending(Resource):
    def __init__(self, db):
        self.db = db

    #TODO (Suyash): create a get endpoint
    # Key: date the user spent money, format date as ("YYYY-MM-DD")
    # Value: amount spent on that day (number)
    # The last date should be the current date (e.g. use something like
    #  datetime.datetime.now().date())
    # The value associated with the current date should equal the money
    # spent on the current date (e.g. 0 if no money spent on current date)
    # sample return json/dict:
    # {
    #    '2024-3-1':50,
    #    '2024-3-12':45,
    #    '2024-3-15':5,
    #    '2024-3-27':0 (in this case, the user spent no money on the current date)
    # }
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        args = parser.parse_args()
        month = args['month']
        reset_user_summary(self.db, user_id, month)
        try:
            user_receipts_ref = self.db.collection('Users').document(user_id).get().to_dict()
            return user_receipts_ref['total']
        except HTTPException as e:
            # TODO: add logging
            return e.data, e.code
        except Exception as e:
            # TODO: add logging
            return {'message': 'An internal server error occurred: ' + str(e)}, 500


class MonthlyCategoryExpenditure(Resource):
    def __init__(self, db):
        self.db = db

    #TODO (Aarnav): create a get endpoint
    # Key: categories (string)
    # Value: amount spent from beginning of this month to now, aka a running total (number)
    # When a new month rolls in (whether or not a receipt has been posted in the new month),
    # {
    #    'groceries':200,
    #    'restaurants':50,
    #    'gas':50
    # }
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        args = parser.parse_args()
        month = args['month']
        reset_user_summary(self.db, user_id, month)
        try:
            print("hi")
            user_receipts_ref = self.db.collection('Users').document(user_id).get().to_dict()
            return user_receipts_ref['category']

            # for receipt in user_receipts_ref:
            #     receipt_data = Receipt.from_dict(receipt.to_dict()).to_dict()
            #     receipt_data['id'] = receipt.id
            #     user_receipts.append(receipt_data)
            # return user_receipts, 200
        except HTTPException as e:
            # TODO: add logging
            return e.data, e.code
        except Exception as e:
            # TODO: add logging
            return {'message': 'An internal server error occurred: ' + str(e)}, 500