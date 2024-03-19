from flask import Flask, request, jsonify
from firebase import firebase
from firebase_admin import credentials, firestore, initialize_app
import json
from datetime import datetime
from flask_restful import Resource, Api


app = Flask(__name__)
api = Api(app)

# Initialize Firestore DB
cred = credentials.Certificate("Source/Backend/Database/key.json")
default_app = initialize_app(cred)
db = firestore.client()


class Receipts(Resource):
  def get (self):
    userId = request.args.get('userId')
    user_ref = db.collection('Users').document(userId).get()
    return jsonify(user_ref.to_dict()), 200



# root endpoint
@app.route("/")
def hello():
  return "Welcome to Receipt+!"

@app.route("/read", methods=['GET'])
def read():
  """
    read() : If not user specified, gets all documents associated with all users.
            Otherwise, gets all documents associated with specified user.
  """
  try:
    userId = request.args.get('id')
    if userId:
      user_ref = db.collection('Users').document(userId).get()
      return jsonify(user_ref.to_dict()), 200
    else:
      users_ref = db.collection('Users')
      allUsers = [doc.to_dict() for doc in users_ref.stream()]
      return jsonify(allUsers), 200
  except Exception as e:
    return f"An Error Occurred: {e}"

### TODO - change date in receipt dictionary from String to Firebase Date object
@app.route("/addReceipt", methods=['POST'])
### arguments: userID (String) and receipt object
### Adds the given receipt to the Receipts collection of the given user.
def addReceipt():
  """
    addReceipt() : adds input receipt to Firestore
  """
  # print(request.args.items())
  try:
    # for key, value in request.args.items():
    #     print(f"{key}: {value}")
    userId = request.args['id']
    userReceipt = request.args['receipt']
    userReceipt = json.loads(userReceipt) # receipt object to json
    userReceipt['date'] = datetime.strptime(userReceipt['date'], "%Y-%m-%d") # date string to datetime object
    userReceipts_ref = db.collection('Users').document(userId).collection('Receipts')
    _, addReceipt_ref = userReceipts_ref.add(userReceipt)
    return f"Added document with id {addReceipt_ref.id}"
  except Exception as e:
    print('error')
    return f"An Error Occurred: {e}"


app.run(debug=True)