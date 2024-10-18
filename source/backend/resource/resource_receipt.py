from datetime import datetime
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
import re

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
        'purchases': [{'name':{name of item},'price':{unit price},'quantity':{quantity}},
                    {'name':{name of item},'price':{unit price},'quantity':{quantity}},
                    {'name':{name of item},'price':{unit price},'quantity':{quantity}}
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

    inputDate = result['amazon']['extracted_data'][0]["financial_document_information"]['invoice_date']
    outputDate = ""

    months = {"jan": "01", "feb": "02", "mar": "03", "apr": "04",
            "may": "05", "jun": "06", "jul": "07", "aug": "08",
            "sep": "09", "oct": "10", "nov": "11", "dec": "12"}
    splitList = []

    # 09/12/2024
    if "/" in inputDate:
        splitList = inputDate.split("/")

    # 09-12-2024
    elif "-" in inputDate:
        splitList = inputDate.split("-")

    # Sep 12, 2024
    elif inputDate[0:3].lower() in months:
        splitList = inputDate.split(" ")

    try:
        month = months[splitList[0][0:3].lower()]
    except:
        month = splitList[0]
    day = splitList[1]
    year = splitList[2]

    if len(year) == 2:
        year = "20" + year
    if len(month) == 1:
        month = "0" + month
    if "," in day:
        day = day[:-1]
    if len(day) == 1:
        day = "0" + day
        
    assert int(month) >= 1 and int(month) <= 12
    assert int(day) >= 1 and int(day) <= 31
    assert int(year) >= 2000 and int(year) < 2100

    outputDate = year + "-" + month + "-" + day

    output = {
        'receipt_date': outputDate,
        'total': result['amazon']['extracted_data'][0]['payment_information']['amount_due'],
        'store': result['amazon']['extracted_data'][0]['merchant_information']['name'],
        'location': result['amazon']['extracted_data'][0]['merchant_information']['address'],
        'purchases': []
    }
    # {'name':{name of item},'price':{unit price},'quantity':{quantity}},{'name':{name of item},'price':{unit price},'quantity':{quantity}}
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
    receipt_date_object = datetime.strptime(data.get('receipt_date'), '%Y-%m-%d')
    collection_date = receipt_date_object.strftime('%Y-%m')

    receipt_collection = db.collection('Users').document(user_id).collection(collection_date)
    receipt_collection.add(receipt.to_dict())
    receipt_summary_ref = receipt_collection.document("Monthly Summary")
    receipt_summary = receipt_summary_ref.get().to_dict()
    ### Summary document exists in given date collection
    if receipt_summary:

        ### Update monthly running total
        total = receipt_summary['total']
        if not (str(receipt_date_object.day) in total):
            total[str(receipt_date_object.day)] = receipt.total
        else:
            total[str(receipt_date_object.day)] = total[str(receipt_date_object.day)] + receipt.total

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
            'total': {str(receipt_date_object.day):receipt.total},
            'category': {receipt.category:receipt.total}
        })
    
    # Call the helper function for each purchase item in the receipt
    zip_code = find_zip_code(data.get('location'))
    if zip_code:
        for item in receipt.purchases:
            update_price_watch(
                zip_code=zip_code, 
                store_address=parse_address(data.get('location')), 
                store_name=receipt.store,
                item_name=item.get('name'),
                item_price=item.get('price'),
                current_date=data.get('receipt_date')
            )
    return jsonify({'message': 'Receipt uploaded successfully.'}), 201

def parse_address(location):
    address_parts = location.split(',')
    return address_parts[0]

def find_zip_code(address):
    zip_code_regex = re.compile(r"[0-9]{5}")
    match = zip_code_regex.search(address)
    return match.group() if match else None

def update_price_watch(zip_code, store_address, store_name, item_name, item_price, current_date):
    db = current_app.db
    address_to_price = db.collection('ZipCodes').document(zip_code).collection('Items').document(item_name)
    
    doc = address_to_price.get()

    if doc.exists:
        # Document exists; retrieve the stored data
        stored_data = doc.to_dict()
        stores = stored_data.get('stores', {})

        # Check if the specific store address exists in the 'stores' map
        store_data = stores.get(store_address)

        if store_data:
            # Store exists, compare dates
            stored_date = store_data.get('date')

            if stored_date and current_date > stored_date:
                # Update the store with the new price and date
                stores[store_address] = {
                    'date': current_date,
                    'price': item_price,
                    'store_address': store_address,
                    'store_name': store_name
                }
                # Update the document with the new 'stores' map
                address_to_price.update({
                    'stores': stores
                })
        else:
            # Store does not exist, add it
            stores[store_address] = {
                'date': current_date,
                'price': item_price,
                'store_address': store_address,
                'store_name': store_name
            }
            # Update the document with the new 'stores' map
            address_to_price.update({
                'stores': stores
            })

    else:
        # Document does not exist; create it with the current date and price in 'stores' map
        address_to_price.set({
            'stores': {
                store_address: {
                    'date': current_date,
                    'price': item_price,
                    'store_address': store_address,
                    'store_name': store_name
                }
            }
        })

@receipts_bp.route('/receipt_info', methods=['POST'])
@login_required
def receipt_info():
    # Returns [{'store_name':'{name of the store}', 'address':'{address of the store}','date':'{the date the item price corresponds to}','price':{price of the item}},
    #  {'store_name':'{name of the store}', 'address':'{address of the store}','date':'{the date the item price corresponds to}','price':{price of the item}},...
    # ]
    # zip_code = request.args.get('zip_code')
    # item_name = request.args.get('item_name')
    data = request.get_json()
    zip_code = data.get('zip_code')
    item_name = data.get('item_name')
    if not zip_code or not item_name:
        return jsonify({'error': 'zip_code and item_name are required'}), 400
    
    receipt_info = []
    db = current_app.db
    zip_item = db.collection('ZipCodes').document(zip_code).collection('Items').document(item_name)
    doc = zip_item.get()
    
    if doc.exists:
        stored_data = doc.to_dict()
        stores = stored_data.get('stores', {})
        if stores:
            for store_address, store_data in stores.items():
                # Each 'store_data' is a dictionary with details about the store
                receipt_info.append({
                    'store_name': store_data.get('store_name'),
                    'address': store_data.get('store_address'),
                    'date': store_data.get('date'),
                    'price': store_data.get('price')
                })
    return jsonify(receipt_info), 200


@receipts_bp.route('/get_items_by_zipcode', methods=['POST'])
@login_required
def get_items_by_zipcode():
    # Extract the 'zipcode' from the query parameters
    data = request.get_json()
    zip_code = data.get('zip_code')
    # zip_code = request.args.get('zipcode')

    # Check if 'zipcode' is provided
    if not zip_code:
        return jsonify({'error': 'zipcode is required'}), 400

    # Initialize an empty list to store item names
    item_names = []
    
    # Access the Firestore database collection for the given zipcode
    db = current_app.db
    zip_items = db.collection('ZipCodes').document(zip_code).collection('Items')

    # Get all documents in the 'Items' collection for the specified zipcode
    items_docs = zip_items.stream()

    # Loop through each document and append the item names
    for doc in items_docs:
        item_names.append(doc.id)  # The document ID corresponds to the item name

    return jsonify(item_names), 200

# Gets all the YYYY-MM the user has receipts in
@receipts_bp.route('/receipt_date_brackets', methods=['GET'])
@login_required
def receipt_date_brackets():
    db = current_app.db
    user_id = current_user.id
    user_ref = db.collection('Users').document(user_id)
    receipt_collections = user_ref.collections()
    receipt_date_brackets = []
    for receipt_collection in receipt_collections:
        receipt_date_brackets.append(receipt_collection.id)
    receipt_date_brackets = sorted(receipt_date_brackets, reverse = True) # sort with most recent YYYY-MM at front of list
    return jsonify(receipt_date_brackets), 200

# Gets all receipts for a given YYYY-MM
@receipts_bp.route('/get_receipts', methods=['POST'])
@login_required
def get_receipts():
    data = request.get_json()
    year_month = data.get('year_month')
    db = current_app.db
    user_id = current_user.id
    receipt_collection_ref = db.collection('Users').document(user_id).collection(year_month)
    receipts = receipt_collection_ref.stream()
    receipts_list = []
    for receipt in receipts:
        if receipt.id != 'Monthly Summary':
            receipts_list.append(receipt.to_dict())
    return sorted(receipts_list, key=lambda x: x['date'], reverse=True)

    


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

