from datetime import datetime
from model.store import Store
from model.item import Item

class Receipt:

    #TODO: add a field to store receipt image, and proper way to make it into dict/json form
    def __init__(self, store, receipt_date, category, purchases, total):
        self.store = store
        self.receipt_date = receipt_date
        self.purchases = purchases
        self.category = category
        self.total = total

    #TODO: create an exception for handling failure to create receipt from dict
    @staticmethod
    def from_dict(dict):
        store = Store.from_dict(dict.get('store')) # store dict -> store object
        receipt_date_value = dict.get('receipt_date')
        if isinstance(receipt_date_value, str):
            receipt_date = datetime.strptime(receipt_date_value, "%Y-%m-%d") # YYYY-MM-DD -> datetime object
        else:
            receipt_date = datetime.fromisoformat(str(receipt_date_value))
        purchases = dict.get('purchases')
        items = []
        for purchase in purchases:
            items.append(Item.from_dict(purchase)) # item dict -> item object
        category = dict.get('category')
        total = dict.get('total')
        return Receipt(store=store, receipt_date=receipt_date, purchases=items, category=category, total = total)


    def to_dict(self):
        storeDict = self.store.to_dict() # store object -> store dict
        purchasesDict = [item.to_dict() for item in self.purchases] # item object -> item dict
        receipt_date = self.receipt_date.strftime('%Y-%m-%d')
        return {
        'store': storeDict,
        'receipt_date': receipt_date,
        'purchases': purchasesDict,
        'category' : self.category,
        'total' : self.total
        }

    #TODO: verify input
    @staticmethod
    def verify_receipt(dict):
        pass