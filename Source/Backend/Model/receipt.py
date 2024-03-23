from firebase_admin import firestore
from flask_restful import Resource
from flask import Response, request
import json
from datetime import datetime
from Model.store import store as modelStore
from Model.item import item as modelItem

class receipt:

    def __init__(self, store, date, purchases = []):
        self.store = store
        self.date = date
        self.purchases = purchases

    @staticmethod
    def from_dict(source):
        store = modelStore.from_dict(source.get('store')) # store dict -> store object
        date_value = source.get('date')
        if isinstance(date_value, str):
            date = datetime.strptime(date_value, "%Y-%m-%d") # YYYY-MM-DD -> datetime object
        else:
            date = datetime.fromisoformat(str(date_value))
        purchases = source.get('purchases')
        items = []
        for purchase in purchases:
            items.append(modelItem.from_dict(purchase)) # item dict -> item object
        return receipt(store=store, date=date, purchases=items)


    def to_dict(self):
        storeDict = self.store.to_dict() # store object -> store dict
        purchasesDict = [item.to_dict() for item in self.purchases] # item object -> item dict
        # date = self.date.strftime('%Y-%m-%d')
        return {
        'store': storeDict,
        'date': self.date,
        'purchases': purchasesDict
        }

    def to_json(self):
        storeDict = self.store.to_dict() # store object -> store dict
        purchasesDict = [item.to_dict() for item in self.purchases] # item object -> item dict
        date = self.date.strftime('%Y-%m-%d')
        return {
        'store': storeDict,
        'date': date,
        'purchases': purchasesDict
        }


    ### arguments: userID (String) and receipt object
    ### Adds the given receipt to the Receipts collection of the given user.
    def addReceipt():
        """
            addReceipt() : adds input receipt to Firestore
        """
        # print(request.args.items())
        try:
            # for key, value in request.args.items():
            #     print(f"{key}: {value}")
            userId = request.args['id']
            userReceipt = request.args['receipt']
            userReceipt = json.loads(userReceipt) # receipt object to json
            userReceipt['date'] = datetime.strptime(userReceipt['date'], "%Y-%m-%d") # date string to datetime object
            userReceipts_ref = db.collection('Users').document(userId).collection('Receipts')
            _, addReceipt_ref = userReceipts_ref.add(userReceipt)
            return f"Added document with id {addReceipt_ref.id}"
        except Exception as e:
            print('error')
            return f"An Error Occurred: {e}"