from passlib.hash import sha256_crypt

class user:

    def __init__(self, userID):
        self.userID = userID
        self.passwordHash = None  # Initialize passwordHash to None

    def hashPassword(self, password):
        """
        Hashes the provided password using sha256_crypt and sets the passwordHash attribute.
        """
        self.passwordHash = sha256_crypt.hash(password)

    def to_dict(self):
        return {
        'userID': self.userID,
        'passwordHash': self.hashPassword
        }