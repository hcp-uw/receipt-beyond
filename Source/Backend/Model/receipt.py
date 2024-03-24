from datetime import datetime
from model.store import Store
from model.item import Item

class Receipt:

    def __init__(self, store, date, purchases = []):
        self.store = store
        self.date = date
        self.purchases = purchases

    @staticmethod
    def from_dict(dict):
        store = Store.from_dict(dict.get('store')) # store dict -> store object
        date_value = dict.get('date')
        if isinstance(date_value, str):
            date = datetime.strptime(date_value, "%Y-%m-%d") # YYYY-MM-DD -> datetime object
        else:
            date = datetime.fromisoformat(str(date_value))
        purchases = dict.get('purchases')
        items = []
        for purchase in purchases:
            items.append(Item.from_dict(purchase)) # item dict -> item object
        return Receipt(store=store, date=date, purchases=items)


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