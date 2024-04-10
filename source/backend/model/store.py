class Store:

    # dictionary of items objects
    def __init__(self, name, address):
        self.name = name
        self.address = address

    @staticmethod
    def from_dict(source):
        name = source.get('name')
        address = source.get('address')
        return Store(name=name, address=address)

    def to_dict(self):
        return {
        'name': self.name,
        'address': self.address
        }

    def __repr__(self):
        return f"store(name={self.name}, address={self.address})"