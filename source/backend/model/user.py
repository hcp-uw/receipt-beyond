from passlib.hash import sha256_crypt
from flask_login import LoginManager, UserMixin
from flask import Flask, request, jsonify, session
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from datetime import datetime

class User(UserMixin):

    def __init__(self, user_id):
        self.id = user_id

    def to_dict(self):
        return {
            'username': self.user_id,
        }
