import requests
from Model.item import item
from Model.receipt import receipt
from Model.store import store
from datetime import datetime
import json

url = "http://127.0.0.1:5000/addReceipt" # URL of API endpoint


user = 'David'
myItems = [item('Orange', 10.00).to_dict(), item('Milk', 4.99).to_dict(), item('Eggs', 5.99).to_dict()]
myStore = store("Trader Joe's", "4555 Roosevelt Way NE, Seattle, WA 98105").to_dict()
myDate = "2024-03-10"
myReceipt = receipt(myStore, myDate ,myItems)
myReceipt = json.dumps(myReceipt.to_dict())

print("AHHHHHHH")
print(myReceipt)
# print(myReceipt.to_dict())

# print(myReceipt)

# Define the query parameters
params = {'id': 'David', 'receipt': myReceipt}
# # Make a GET request to the endpoint with the query parameters
response = requests.post(url, params=params)
# # Print the response
# print(response.json())






# url = "http://127.0.0.1:5000/read" # URL of API endpoint
# # Define the query parameters
# params = {'id': 'David'}
# # # Make a GET request to the endpoint with the query parameters
# response = requests.get(url, params=params)
# # # Print the response
# print(response.json())