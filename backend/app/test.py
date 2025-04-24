from fastapi.testclient import TestClient
# Adjust the import path based on your project structure
from app.main import app # Assuming your FastAPI instance is named 'app' in 'app/main.py'

# Create a TestClient instance
client = TestClient(app)

def test_get_token_success():
    # Simulate the form data the frontend sends
    response = client.post(
        "/api/auth/token",
        data={"username": "testuser", "password": "testpassword"}
        # Note: TestClient handles the 'application/x-www-form-urlencoded' header
        # automatically when you pass 'data='
    )
    # Assuming a successful login returns 200 OK
    # and the response body contains an 'access_token'
    # !!! IMPORTANT: This test assumes a user 'testuser' with password 'testpassword'
    # exists or can be created for testing (e.g., using fixtures) !!!
    assert response.status_code == 200 # Or maybe 401/404 if the user doesn't exist yet
    # assert "access_token" in response.json() # Uncomment and adapt based on actual response

def test_get_token_invalid_credentials():
    response = client.post(
        "/api/auth/token",
        data={"username": "wronguser", "password": "wrongpassword"}
    )
    # FastAPI's default for OAuth2PasswordRequestForm errors is 401 Unauthorized
    assert response.status_code == 401
    assert "detail" in response.json()
    assert response.json()["detail"] == "Incorrect username or password" # Or your specific error message

def test_register_user_success():
    # Use unique data for each test run if possible, or clean up afterwards
    test_username = "newtestuser"
    test_email = "newtest@example.com"
    test_password = "newpassword"

    response = client.post(
        "/api/auth/register",
        json={"username": test_username, "email": test_email, "password": test_password}
    )
    # Assuming successful registration returns 200 OK (or 201 Created)
    assert response.status_code == 200 # Adjust if your API returns 201
    assert response.json()["username"] == test_username
    assert response.json()["email"] == test_email
    # Ensure password is not returned!

def test_register_user_duplicate_username():
     # First, register a user (or ensure one exists from a previous test/fixture)
    client.post(
        "/api/auth/register",
        json={"username": "existinguser", "email": "existing@example.com", "password": "password123"}
    )
     # Now, try to register again with the same username
    response = client.post(
        "/api/auth/register",
        json={"username": "existinguser", "email": "another@example.com", "password": "password456"}
    )
    # Assuming a duplicate username returns a 400 Bad Request
    assert response.status_code == 400
    assert "detail" in response.json()
    # Check for your specific error message (e.g., "Username already registered")

# Add more tests for other scenarios (duplicate email, invalid data, etc.)
