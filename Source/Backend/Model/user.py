from passlib.hash import sha256_crypt

from flask_httpauth import HTTPBasicAuth

class user:

    def __init__(self, userID):
        self.userID = userID
        self.passwordHash = None  # Initialize passwordHash to None

    def hashPassword(self, password):
        """
        Hashes the provided password using sha256_crypt and sets the passwordHash attribute.
        """
        self.passwordHash = sha256_crypt.hash(password)

    def verifyPassword(self, password):
        """
        Verifies if the provided password matches the stored password hash.
        Returns True if the password matches, False otherwise.
        """
        if self.passwordHash is None:
            return False  # If passwordHash is not set, return False

        return sha256_crypt.verify(password, self.passwordHash)

    def to_dict(self):
        return {
        'userID': self.userID,
        'passwordHash': self.hashPassword
        }