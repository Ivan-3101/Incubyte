# tests/test_auth.py
#! ABANDONED THIS TEST BS FOR NOW
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_create_user_success():
    # Define the new user's data
    user_data = {"email": "test@example.com", "password": "a-strong-password"}
    
    # Make a POST request to the (not-yet-existing) endpoint
    response = client.post("/api/auth/register", json=user_data)
    
    # Assert that the request was successful
    assert response.status_code == 200, response.text
    
    # Assert that the response body has the correct data
    data = response.json()
    assert data["email"] == user_data["email"]
    assert "id" in data
    assert "password" not in data

def test_login_user_success(client):
    # First, create a user to log in with
    user_data = {"email": "login_test@example.com", "password": "password123"}
    client.post("/api/auth/register", json=user_data) # Create the user

    # Now, attempt to log in
    login_data = {"username": user_data["email"], "password": user_data["password"]}
    response = client.post("/api/auth/login", data=login_data) # Note: login is form data, not json

    # Assert that the login was successful
    assert response.status_code == 200, response.text

    # Assert the response contains an access token
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"