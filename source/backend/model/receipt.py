from datetime import datetime
from model.store import Store
from model.item import Item

class Receipt:

    #TODO: add a field to store receipt image, and proper way to make it into dict/json form
    def __init__(self, receipt_date, category, total, store = None, location = None, purchases = None):
        self.receipt_date = datetime.strptime(receipt_date, '%Y-%m-%d')
        self.category = category
        self.total = total
        self.store = store
        self.location = location
        self.purchases = purchases


    #TODO: create an exception for handling failure to create receipt from dict
    # @staticmethod
    # def from_dict(dict):


    #     store = Store.from_dict(dict.get('store')) # store dict -> store object
    #     receipt_date_value = dict.get('receipt_date')
    #     if isinstance(receipt_date_value, str):
    #         receipt_date = datetime.strptime(receipt_date_value, "%Y-%m-%d") # YYYY-MM-DD -> datetime object
    #     else:
    #         receipt_date = datetime.fromisoformat(str(receipt_date_value))
    #     purchases = dict.get('purchases')
    #     items = []
    #     for purchase in purchases:
    #         items.append(Item.from_dict(purchase)) # item dict -> item object
    #     category = dict.get('category')
    #     total = dict.get('total')
    #     return Receipt(store=store, receipt_date=receipt_date, purchases=items, category=category, total = total)


    def to_dict(self):
        return {
            'date':self.receipt_date,
            'category':self.category,
            'total':self.total,
            'store':self.store,
            'location':self.location,
            'purchases':self.purchases
        }
