from datetime import datetime
from flask_restful import Resource, reqparse, abort
from model.receipt import Receipt
from flask_jwt_extended import get_jwt_identity, jwt_required
# from resource.resource_summary import reset_user_summary
from werkzeug.exceptions import HTTPException
from flask_login import login_required
from flask_login import current_user, login_required
import firebase_admin
from firebase_admin import firestore as admin_firestore
from firebase_admin import credentials, initialize_app, firestore
from flask import Blueprint, request, jsonify, abort
from decimal import Decimal

receipt_parser = reqparse.RequestParser()
# required fields
receipt_parser.add_argument('receipt_date', type=str, required=True, help='Receipt date is required.') # expects a string: YYYY-MM-DD
receipt_parser.add_argument('category', type=str, required=True, help='Receipt category is required.')
receipt_parser.add_argument('total', type=float, required=True, help='Receipt total is required.')

# optional fields
receipt_parser.add_argument('store', type=str, required=False)
receipt_parser.add_argument('location', type=str, required=False)
receipt_parser.add_argument('purchases', action='append', type=dict, required=False) # type append for a list of objects

# Initialize Firestore DB
firebase_admin.get_app()
db = firestore.client()
receipts_bp = Blueprint('receipts', __name__)

# Adds a receipt to the user
@receipts_bp.route('/receipts', methods=['POST'])
@login_required
def post():
    try:
        user_id = current_user.id
        args = receipt_parser.parse_args()
        receipt = Receipt(receipt_date=args['receipt_date'], category=args['category'], total=args['total'],
                          store=args['store'], location=args['location'], purchases=args['purchases'])

        collection_date = receipt.receipt_date.strftime('%Y-%m')
        receipt_collection = db.collection('Users').document(user_id).collection(collection_date)
        receipt_collection.add(receipt.to_dict())
        receipt_summary_ref = receipt_collection.document("Monthly Summary")
        receipt_summary = receipt_summary_ref.get().to_dict()
        ### Summary document exists in given date collection
        if receipt_summary:

            ### Update monthly running total
            total = receipt_summary['total']
            if not (str(receipt.receipt_date.day) in total):
                total[str(receipt.receipt_date.day)] = receipt.total
            else:
                total[str(receipt.receipt_date.day)] = total[str(receipt.receipt_date.day)] + receipt.total

            ### Update category totals
            category = receipt_summary["category"]
            if not (receipt.category in category):
                category[receipt.category] = receipt.total
            else:
                category[receipt.category] = category[receipt.category] + receipt.total

            ### Update Firebase
            receipt_summary_ref.update({
                "total": total,
                "category": category
            })

        ### Summary document does not exists in given date collection
        else:

            ### Update Firebase
            receipt_summary_ref.set({
                'total': {str(receipt.receipt_date.day):receipt.total},
                'category': {receipt.category:receipt.total}
            })
        return {'message': 'Receipt uploaded successfully.'}, 201
    except HTTPException as e:
        return {'message': e.description}, e.code
    except Exception as e:
        return {'message': str(e)}, 500

#TODO: add a put endpoint for when the user edits receipts. Make sure to roll changes over to resource_summary

#TODO: add a delete endpoint for when the user deletes a receipt.





# Returns a list of all receipts of the current user.
# If current user has no receipts, returns an empty list.
################ NEED TO IMPLEMENT BASED OFF NEW DATABASE STRUCTURE, TAKE START: YYYY-MM and END: YYYY-MM range
# @receipts_bp.route('/receipts', methods=['GET'])
# @login_required
# def get():
#     user_id = current_user.id
#     try:
#         user_receipts_ref = db.collection('Users').document(user_id).collection('Receipts').get()
#         user_receipts = []
#         for receipt in user_receipts_ref:
#             receipt_data = Receipt.from_dict(receipt.to_dict()).to_dict()
#             receipt_data['id'] = receipt.id
#             user_receipts.append(receipt_data)
#         return user_receipts, 200
#     except Exception as e:
#         # TODO: add logging
#         return {'message': 'An internal server error occurred: ' + str(e)}, 500

