from flask import Flask, request, jsonify
from firebase import firebase
from firebase_admin import credentials, firestore, initialize_app
import json

app = Flask(__name__)

# Initialize Firestore DB

cred = credentials.Certificate("Source/Backend/Firebase/key.json")
default_app = initialize_app(cred)
db = firestore.client()
# users_ref = db.collection('Users')


# "None" in initialization of firebase means no authentication defined yet
# firebase = firebase.FirebaseApplication('https://receiptplus-c6878-default-rtdb.firebaseio.com/', None)

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
def addReceipt():
  """
    addReceipt() : adds input receipt to Firestore
  """
  print(request.args.items())
  try:
    for key, value in request.args.items():
        print(f"{key}: {value}")
    userId = request.args.get('id')
    userReceipt = request.args.get('receipt')
    userReceipt = json.loads(userReceipt)
    userReceipts_ref = db.collection('Users').document(userId).collection('Receipts')
    _, addReceipt_ref = userReceipts_ref.add(userReceipt)
    return f"Added document with id {addReceipt_ref.id}"
  except Exception as e:
    return f"An Error Occurred: {e}"

if __name__ == "__main__":
  app.run(debug=True)
