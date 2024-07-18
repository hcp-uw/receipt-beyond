import json
import pytest
from server_main import app  # Import your Flask app object

@pytest.fixture(scope='session')
def global_variables():
    return {
        'user_id': 'Testor',
        'password': 'Testor',
        'email': 'Testor@gmail.com',
        'date_joined': '2024-07-17'
    }

@pytest.fixture
def client():
    app.testing = True
    with app.test_client() as client:
        yield client

def test_start_endpoint(client):
    response = client.get('/')
    assert response.data.decode('utf-8') == "!!!Hello and welcome to the Receipt Plus API!!!"

def test_register_successful_or_fail(client, global_variables):
    new_user = {
        'user_id': global_variables['user_id'],
        'password': global_variables['password'],
        'email': global_variables['email'],
        'date': global_variables['date_joined']
    }
    response = client.post('/api/register', json = new_user)
    if response.status_code == 400:
        expected_status = 400
        expected_response = {
            "error": "User already exists"
        }
    elif response.status_code == 200:
        expected_status = 200
        expected_response = {
            "message": f'{new_user["user_id"]} logged in successfully.'
        }
    assert response.status_code == expected_status and json.loads(response.data) == expected_response



def test_user_info_and_login(client, global_variables):
    existing_user = {
        'user_id': global_variables['user_id'],
        'password': global_variables['password'],
    }
    response = client.post('/api/login', json = existing_user)
    expected_response = {
        "message": f'{existing_user["user_id"]} logged in successfully.'
    }
    expected_status = 200
    assert response.status_code == expected_status and json.loads(response.data) == expected_response

    headers = {
        'Cookie': response.headers['Set-Cookie']
    }
    response = client.get('/api/user_info', headers=headers)
    expected_status = 200
    expected_response = {
        "date_joined": global_variables['date_joined'],
        "email": global_variables['email'],
        "user_id": global_variables['user_id']
    }
    assert response.status_code == expected_status and json.loads(response.data) == expected_response
