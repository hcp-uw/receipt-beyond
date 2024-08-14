from flask import jsonify
import logging

class UserAlreadyExistsError(Exception):
    pass

class EmailAlreadyExistsError(Exception):
    pass

class MissingUserIDError(Exception):
    pass

class MissingPasswordError(Exception):
    pass

class MissingEmailError(Exception):
    pass

class UserNotFound(Exception):
    pass

class InvalidPassword(Exception):
    pass

class MissingReceiptDate(Exception):
    pass

class MissingReceiptTotal(Exception):
    pass

class MissingUserDate(Exception):
    pass

class InvalidDateFormat(Exception):
    pass

class MissingReceiptImage(Exception):
    pass

class InvalidReceiptImage(Exception):
    pass

class EdenAIBadRequest(Exception):
    pass

class MissingNewEmail(Exception):
    pass

class MissingNewPasswordError(Exception):
    pass

def handle_missing_new_password(error):
    response = jsonify({'error': 'Missing new password'})
    response.status_code = 400
    return response, response.status_code

def handle_missing_new_email(error):
    response = jsonify({'error': 'Missing new email'})
    response.status_code = 400
    return response, response.status_code


def handle_edenai_bad_request(error):
    response = jsonify({'error': 'EdenAI bad request'})
    response.status_code = 500
    return response, response.status_code

def handle_invalid_receipt_image(error):
    response = jsonify({'error': 'Invalid image'})
    response.status_code = 400
    return response, response.status_code

def handle_missing_receipt_image(error):
    response = jsonify({'error': 'Missing receipt image'})
    response.status_code = 400
    return response, response.status_code

def handle_user_already_exists(error):
    response = jsonify({'error': 'User already exists'})
    response.status_code = 400
    return response, response.status_code


def handle_email_already_exists(error):
    response = jsonify({'error': 'Email already exists'})
    response.status_code = 400
    return response, response.status_code

def handle_missing_user_id(error):
    response = jsonify({'error': 'Missing user id'})
    response.status_code = 400
    return response, response.status_code

def handle_missing_email(error):
    response = jsonify({'error': 'Missing email'})
    response.status_code = 400
    return response, response.status_code

def handle_missing_password(error):
    response = jsonify({'error': 'Missing password'})
    response.status_code = 400
    return response, response.status_code

def handle_invalid_password(error):
    response = jsonify({'error': 'Invalid password'})
    response.status_code = 401
    return response, response.status_code

def handle_user_not_found(error):
    response = jsonify({'error': 'User not found'})
    response.status_code = 401
    return response, response.status_code

def handle_missing_receipt_date(error):
    response = jsonify({'error': 'Missing receipt date'})
    response.status_code = 400
    return response, response.status_code


def handle_missing_receipt_total(error):
    response = jsonify({'error': 'Missing receipt total'})
    response.status_code = 400
    return response, response.status_code

def handle_missing_user_date(error):
    response = jsonify({'error': 'Missing user date'})
    response.status_code = 400
    return response, response.status_code

def handle_invalid_date_format(error):
    response = jsonify({'error': 'Invalid date format'})
    response.status_code = 400
    return response, response.status_code

def handle_general_error(error):
    logging.error(f"Unhandled Exception: {error}", exc_info=True)  # Log the error with stack trace
    response = jsonify({'error': 'An unexpected error occurred'})
    response.status_code = 500
    return response, response.status_code

