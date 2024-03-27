class Item:

    # TODO: add a field for amount (e.g. quantity/weight)

    # dictionary of items objects
    def __init__(self, name, price, amount):
        self.name = name
        self.price = price
        self.amount = amount

    # from_dict(source) is a static method
    @staticmethod
    def from_dict(source):
        name = source.get('name')
        price = source.get('price')
        amount = source.get('amount')
        return Item(name=name, price=price, amount=amount)

    def to_dict(self):
        return {
        'name': self.name,
        'price': self.price,
        'amount': self.amount
        }

    def __repr__(self):
        return f"item(name={self.name}, price={self.price}, amount={self.amount})"