from datetime import datetime
from flask_login import login_required
from flask_login import current_user, login_required
from flask import Blueprint, request, jsonify, current_app
from model.error import *

summary_bp = Blueprint('summary', __name__)

#TODO (Suyash): create a get endpoint
# Key: date the user spent money, format date as ("YYYY-MM-DD")
# Value: amount spent on that day (number)
# The last date should be the current date (e.g. use something like
#  datetime.datetime.now().date())
# The value associated with the current date should equal the money
# spent on the current date (e.g. 0 if no money spent on current date)
# sample return json/dict:
# {
#    '2024-3-1':50,
#    '2024-3-12':45,
#    '2024-3-15':5,
#    '2024-3-27':0 (in this case, the user spent no money on the current date)
# }
@summary_bp.route('/month_exp', methods=['GET'])
@login_required
def month_exp():
    db = current_app.db
    user_id = current_user.id
    data = request.get_json()
    date = data.get('date')
    if not date:
        raise MissingUserDate()
    try:
        date = datetime.strptime(date, '%Y-%m-%d')
    except:
        raise InvalidDateFormat()
    collection_date = date.strftime('%Y-%m')
    monthly_summary = db.collection('Users').document(user_id).collection(collection_date).document('Monthly Summary').get().to_dict()
    return jsonify(monthly_summary['total']), 200


#TODO (Aarnav): create a get endpoint
# Key: categories (string)
# Value: amount spent from beginning of this month to now, aka a running total (number)
# When a new month rolls in (whether or not a receipt has been posted in the new month),
# {
#    'groceries':200,
#    'restaurants':50,
#    'gas':50
# }
@summary_bp.route('/month_cat_exp', methods=['GET'])
@login_required
def month_cat_exp():
    db = current_app.db
    user_id = current_user.id
    data = request.get_json()
    date = data.get('date')
    if not date:
        raise MissingUserDate()
    try:
        date = datetime.strptime(date, '%Y-%m-%d')
    except:
        raise InvalidDateFormat()
    collection_date = date.strftime('%Y-%m')
    monthly_summary = db.collection('Users').document(user_id).collection(collection_date).document('Monthly Summary').get().to_dict()
    return jsonify(monthly_summary['category']), 200