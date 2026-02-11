
import sys
import os
import requests
import asyncio
from typing import Dict, Any

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

BASE_URL = "http://localhost:8000"
TEST_USER = {
    "email": "test@example.com",
    "password": "testpassword123",
    "name": "Test User",
    "role": "client"
}

def test_register():
    print("Testing Registration...")
    try:
        response = requests.post(f"{BASE_URL}/auth/register", json=TEST_USER)
        if response.status_code == 200:
            print("✅ Registration successful")
            return True
        elif response.status_code == 400 and "already exists" in response.text:
             print("✅ User already exists (Skipping registration)")
             return True
        else:
            print(f"❌ Registration failed: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        return False

def test_login():
    print("\nTesting Login...")
    try:
        login_data = {
            "username": TEST_USER["email"],
            "password": TEST_USER["password"]
        }
        response = requests.post(f"{BASE_URL}/auth/login", data=login_data)
        if response.status_code == 200:
            token = response.json().get("access_token")
            if token:
                print("✅ Login successful. Token received.")
                return token
            else:
                 print("❌ Login failed: No token in response")
                 return None
        else:
            print(f"❌ Login failed: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        return None

if __name__ == "__main__":
    print(f"Running Auth Tests against {BASE_URL}")
    print("Ensure uvicorn is running: uvicorn app.main:app --reload")
    
    if test_register():
        token = test_login()
        if token:
            print("\n🎉 Authentication Flow Verified!")
        else:
            print("\n❌ Authentication Flow Failed at Login")
    else:
        print("\n❌ Authentication Flow Failed at Registration")
