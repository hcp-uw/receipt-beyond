class receipt:

    # dictionary of items objects
    def __init__(self, store, date, purchases = []):
        self.store = store
        self.date = date
        self.purchases = purchases

    @staticmethod
    def from_dict(source):
        store = source.get('store')
        date = source.get('date')
        purchases = source.get('purchases', [])
        return receipt(store=store, date=date, purchases=purchases)

    def to_dict(self):
        return {
        'store': self.store,
        'date': self.date,
        'purchases': self.purchases
        }

    def __repr__(self):
        return f"receipt(store={self.store}, date={self.date}, purchases={self.purchases})"