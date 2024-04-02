from flask import Flask
from firebase import firebase

app = Flask(__name__)


# "None" in initialization of firebase means no authentication defined yet
firebase = firebase.FirebaseApplication('https://receiptplus-c6878-default-rtdb.firebaseio.com/', None)

@app.route("/")
def hello():
  return "Welcome!"

@app.route("/products")
def products():
    result = firebase.get('/Items', None) # get JSON content names "Items" with no authentication
    return str(result)

if __name__ == "__main__":
  app.run()
