from datetime import datetime
from model.store import Store
from model.item import Item
from model.error import InvalidDateFormat
class Receipt:

    def __init__(self, receipt_date, total, category = None, store = None, location = None, purchases = None):
        try:
            self.receipt_date = datetime.strptime(receipt_date, '%Y-%m-%d')
        except:
            raise InvalidDateFormat()
        self.total = total
        self.category = category if category is not None else "Other"
        self.store = store
        self.location = location
        self.purchases = purchases

    def to_dict(self):
        return {
            'date':self.receipt_date,
            'category':self.category,
            'total':self.total,
            'store':self.store,
            'location':self.location,
            'purchases':self.purchases
        }