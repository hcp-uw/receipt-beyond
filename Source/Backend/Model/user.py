from passlib.hash import sha256_crypt

class User:

    def __init__(self, user_id):
        self.user_id = user_id
        self.passwordHash = None  # Initialize passwordHash to None

    def hashPassword(self, password):
        """
        Hashes the provided password using sha256_crypt and sets the passwordHash attribute.
        """
        self.passwordHash = sha256_crypt.hash(password)

    def to_dict(self):
        return {
        'userID': self.user_id,
        'passwordHash': self.hashPassword
        }