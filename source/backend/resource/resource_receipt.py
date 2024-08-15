from model.receipt import Receipt
from flask_login import login_required
from flask_login import current_user, login_required
from flask import Blueprint, request, jsonify, current_app
from model.error import *
from PIL import Image
from config import Config
import requests
import os
import uuid

receipts_bp = Blueprint('receipts', __name__)


@receipts_bp.route('/receipts_parsing', methods=['POST'])
@login_required
def receipts_parsing():
    """
    Parses a receipt image and returns parsed receipt
    return the following:
    {
        'receipt_date': {date on receipt},
        'total': {total},
        'store': {store name},
        'location': {store address},
        'purchases': [{'name':{name of item},'price':{unit price},'amount':{amount/quantity}},
                    {'name':{name of item},'price':{unit price},'amount':{amount/quantity}},
                    {'name':{name of item},'price':{unit price},'amount':{amount/quantity}}
                    ...]
    }
    """
    receipt_image = request.files.get('receipt_image')
    if not receipt_image:
        raise MissingReceiptImage()
    
    # Create temp directory if it doesn't exist
    temp_dir = os.path.join(os.getcwd(), 'temp')
    os.makedirs(temp_dir, exist_ok=True)

    # Create a unique filename for image that doesn't exist in temp
    while True:
        filename = f"{uuid.uuid4()}.jpg"
        file_path = os.path.join(temp_dir, filename)
        if not os.path.exists(file_path):
            break  # Exit the loop if the filename is unique

    # Save image into temp folder   
    receipt_image.save(file_path)

    # EdenAI API parameters 
    headers = {"Authorization": f"Bearer {Config.EDENAI_API_KEY}"}
    url = "https://api.edenai.run/v2/ocr/financial_parser"
    data = {
        "providers": "amazon", # DO NOT CHANGE PROVIDER
        "language": "en",
        "document_type" : "receipt",
    }
    try:
        with open(file_path, 'rb') as file:
            files = {'file': file}
            response = requests.post(url, data=data, files=files, headers=headers) # EdenAI docs says accepts JPG, PNG, or PDF
    except:
        raise EdenAIBadRequest()
    finally:
        os.remove(file_path)
    result = response.json()
    
    output = {
        'receipt_date': result['amazon']['extracted_data'][0]["financial_document_information"]['invoice_date'],
        'total': result['amazon']['extracted_data'][0]['payment_information']['amount_due'],
        'store': result['amazon']['extracted_data'][0]['merchant_information']['name'],
        'location': result['amazon']['extracted_data'][0]['merchant_information']['address'],
        'purchases': []
    }
    # {'name':{name of item},'price':{unit price},'amount':{amount/quantity}},{'name':{name of item},'price':{unit price},'amount':{amount/quantity}}
    items = result['amazon']['extracted_data'][0]['item_lines']
    for item in items:
        info = {}
        info['name'] = item['description']
        
        if item['quantity'] == None: 
            info['quantity'] = 1.0
        else:
            info['quantity'] = round(item['amount_line']/item['unit_price'], 2)
            
        if item['unit_price'] == None:
            info['price'] = item['amount_line']
        else:
            info['price'] = item['unit_price']
        
        output['purchases'].append(info)
    return jsonify(output), 201


# Adds a receipt to the user
@receipts_bp.route('/receipts', methods=['POST'])
@login_required
def receipts():
    db = current_app.db
    user_id = current_user.id
    data = request.get_json()
    if not data.get('receipt_date'):
        raise MissingReceiptDate()
    if not data.get('total'):
        raise MissingReceiptTotal()
    receipt = Receipt(receipt_date=data.get('receipt_date'), category=data.get('category'), total=float(data.get('total')),
                        store=data.get('store'), location=data.get('location'), purchases=data.get('purchases'))
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
    return jsonify({'message': 'Receipt uploaded successfully.'}), 201


#TODO: (lower priority) add a put endpoint for when the user edits receipts. Make sure to roll changes over to summary info in db.
# Should take a receipt id, and the changes to be made

#TODO: (lower priority) add a delete endpoint for when the user deletes a receipt. Make sure changes roll over to sumarry info in database.


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

