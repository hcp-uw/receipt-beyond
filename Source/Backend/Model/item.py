class item:

    # TODO: add amount!!
    # dictionary of items objects
    def __init__(self, name, price):
        self.name = name
        self.price = price

    # from_dict(source) is a static method
    @staticmethod
    def from_dict(source):
        name = source.get('name')
        price = source.get('price')
        return item(name=name, price=price)

    def to_dict(self):
        return {
        'name': self.name,
        'price': self.price
        }

    def __repr__(self):
        return f"item(name={self.name}, price={self.price})"