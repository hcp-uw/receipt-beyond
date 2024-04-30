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
            myReceipt = Receipt.from_dict(args)




            myReceipt = Receipt.from_dict(args).to_dict()
            myReceipt['date'] = datetime.strptime(myReceipt['date'], '%Y-%m-%d')
            user_receipts_ref = self.db.collection('Users').document(user_id).collection('Receipts')
            user_receipts_ref.add(myReceipt) # add receipt
            user_db = self.db.collection("Users").document(user_id).get().to_dict()

            ############### Add to Items Collection ##############################
            # Functional... but still needs a lot of cleaning up. Price is converted to
            # string because key in firestore maps must be of type string.
            for purchase in myReceipt['purchases']:
                item_db = self.db.collection("Items").document(purchase['name']).get()
                if item_db.exists:
                    item_data = item_db.to_dict()
                    if myReceipt['store']['address'] in item_data:
                        if str(purchase['price']) in item_data[myReceipt['store']['address']]['price']:
                            item_data[myReceipt['store']['address']]['price'][str(purchase['price'])] = item_data[myReceipt['store']['address']]['price'][str(purchase['price'])] + 1
                            self.db.collection("Items").document(purchase['name']).update(item_data)
                        else:
                            item_data[myReceipt['store']['address']]['price'][str(purchase['price'])] = 1
                            self.db.collection("Items").document(purchase['name']).update(item_data)
                    else:
                        new_item = {myReceipt['store']['address']:{'name': myReceipt['store']['name'], 'price': {str(purchase['price']):1}}}
                        self.db.collection("Items").document(purchase['name']).update(new_item)
                else:
                    new_item = {myReceipt['store']['address']:{'name': myReceipt['store']['name'], 'price': {str(purchase['price']):1}}}
                    print(new_item)
                    self.db.collection("Items").document(purchase['name']).set(new_item)


            ###############################################################
            #TODO (Suyash): Update the 'total' field of the current user.
            # If the day (key) already exists in 'total', add the total
            # from this receipt to the total (value) for that day.
            # In other words, update '(day of receipt)':(previous total) to
            # '(day of receipt)':(previous total + this receipt total).
            # If the day does not exist in 'total', add the
            # '(day of receipt)':(this receipt total) to 'total' field.
            # If a new month rolls over, delete everything in 'total'
            # from the previous month...
            # A possible idea is to just delete the 'total' field at the
            # beginning of each month to "start over from scratch"
            total = user_db.get("total")
            if total is None: # create total map if not in database
                total = {
                    str(myReceipt['date'].day):myReceipt['total'] # add first day and total from this receipt
                }
                self.db.collection("Users").document(user_id).update({"total": total})
            else:
                ################## WRITE YOUR IMPLEMENTATION HERE#######################
                ########################################################################
                pass

            #TODO (Aarnav): Update the 'category' field of the current user.
            # If the category of this receipt does not exist as a key
            # in category, add '(category of this receipt)':(this receipt total)
            # to the 'category' field.
            # If the category of this receipt does exist as a key in category,
            # update like so '(category of this receipt)':(previous total + this receipt total).
            # If a new month rolls over, delete all existing categories (from previous month)...
            # A possible idea is to just delete the 'category' field at the
            # beginning of each month to "start over from scratch"
            category = user_db.get("category")
            if category is None: # create category map if not in database
                category = {
                    myReceipt['category']:myReceipt['total'] #add first category and total from this receipt
                }
                self.db.collection("Users").document(user_id).update({"category": category})
            else:
                ################## WRITE YOUR IMPLEMENTATION HERE#######################
                ########################################################################
                if not (myReceipt['category'] in category):
                    category[myReceipt['category']] = myReceipt['total']
                else:
                    category[myReceipt['category']] = category[myReceipt['category']] + myReceipt['total']
                self.db.collection("Users").document(user_id).update({"category": category})
            return {'message': 'Receipt received successfully'}, 201
        except Exception as e:
            # TODO: add logging
            print({'message': 'An internal server error occurred: ' + str(e)}, 500)
            return {'message': 'An internal server error occurred: ' + str(e)}, 500

    #TODO: add a put endpoint for when the user edits receipts. Make sure to roll changes over to resource_summary

    #TODO: add a delete endpoint for when the user deletes a receipt.