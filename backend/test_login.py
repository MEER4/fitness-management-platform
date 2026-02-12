import requests
import json

BASE_URL = "http://localhost:8000"

def test_flow():
    email = "newuser@example.com"
    password = "password123"
    
    # 1. Register
    print(f"Registering {email}...")
    register_data = {
        "email": email,
        "password": password,
        "full_name": "Test User",
        "role": "client"
    }
    
    try:
        r = requests.post(f"{BASE_URL}/auth/register", json=register_data)
        if r.status_code == 200:
            print("Registration SUCCESS")
        elif r.status_code == 400 and "already exists" in r.text:
            print("User already exists, proceeding to login.")
        else:
            print(f"Registration FAILED: {r.status_code} {r.text}")
            return
            
        # 2. Login
        print(f"Logging in {email}...")
        login_data = {
            "username": email,
            "password": password
        }
        r = requests.post(f"{BASE_URL}/auth/login", data=login_data)
        
        if r.status_code == 200:
            token = r.json().get("access_token")
            print(f"Login SUCCESS! Token: {token[:20]}...")
        else:
            print(f"Login FAILED: {r.status_code} {r.text}")
            
    except Exception as e:
        print(f"Exception: {e}")

if __name__ == "__main__":
    test_flow()
