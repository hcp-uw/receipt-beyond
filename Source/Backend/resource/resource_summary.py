from flask_restful import Resource, reqparse, abort
from model.receipt import Receipt
from flask_jwt_extended import get_jwt_identity, jwt_required

#TODO: create a get endpoint that takes in a month, and returns a json
#       of the running total for each date
class MonthlyRunningTotal(Resource):

    @jwt_required()
    def get(self):
        pass


#TODO: create a get endpoint that takes in a month, and returns a json
#       of the total amount spend so far in each category
class MonthlyCategoryExpenditure(Resource):

    @jwt_required()
    def get(self):
        pass