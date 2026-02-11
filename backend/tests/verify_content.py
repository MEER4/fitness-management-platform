
import sys
import os
import requests
import json
import time

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

BASE_URL = "http://localhost:8000"

COACH_USER = {
    "email": "coach@example.com",
    "password": "password123",
    "name": "Coach Test",
    "role": "coach"
}

CLIENT_USER = {
    "email": "client@example.com",
    "password": "password123",
    "name": "Client Test",
    "role": "client"
}

def get_token(user_data):
    # Register (ignore if exists)
    try:
        requests.post(f"{BASE_URL}/auth/register", json=user_data)
    except:
        pass
    
    # Login
    login_data = {
        "username": user_data["email"],
        "password": user_data["password"]
    }
    response = requests.post(f"{BASE_URL}/auth/login", data=login_data)
    if response.status_code == 200:
        return response.json().get("access_token")
    return None

def verify_content_creation():
    print("Getting tokens...")
    coach_token = get_token(COACH_USER)
    client_token = get_token(CLIENT_USER)
    
    if not coach_token or not client_token:
        print("❌ Failed to get tokens")
        return False
        
    print("✅ Tokens received")
    
    # 1. Coach creates Plan
    print("\n[COACH] Creating Plan...")
    plan_data = {
        "title": "Pro Plan",
        "price": 99.99,
        "duration": 30,
        "description": "Best plan ever"
    }
    headers = {"Authorization": f"Bearer {coach_token}"}
    res = requests.post(f"{BASE_URL}/plans/", json=plan_data, headers=headers)
    if res.status_code == 200:
        print("✅ Coach created plan")
    else:
        print(f"❌ Coach failed to create plan: {res.status_code} {res.text}")
        return False

    # 2. Client creates Plan (Should Fail)
    print("\n[CLIENT] Creating Plan (Expect 403)...")
    res = requests.post(f"{BASE_URL}/plans/", json=plan_data, headers={"Authorization": f"Bearer {client_token}"})
    if res.status_code == 403:
        print("✅ Client correctly blocked (403)")
    else:
        print(f"❌ Client WAS NOT BLOCKED: {res.status_code} {res.text}")
        return False

    # 3. Coach creates Workout
    print("\n[COACH] Creating Workout...")
    workout_data = {
        "title": "Leg Day",
        "description": "Heavy squats",
        "level": "advanced"
    }
    res = requests.post(f"{BASE_URL}/workouts/", json=workout_data, headers=headers)
    if res.status_code == 200:
        print("✅ Coach created workout")
    else:
        print(f"❌ Coach failed to create workout: {res.status_code} {res.text}")
        return False

    # 4. Client creates Workout (Should Fail)
    print("\n[CLIENT] Creating Workout (Expect 403)...")
    res = requests.post(f"{BASE_URL}/workouts/", json=workout_data, headers={"Authorization": f"Bearer {client_token}"})
    if res.status_code == 403:
        print("✅ Client correctly blocked (403)")
    else:
        print(f"❌ Client WAS NOT BLOCKED: {res.status_code} {res.text}")
        return False

    # 5. List items
    print("\n[PUBLIC] Listing Plans...")
    res = requests.get(f"{BASE_URL}/plans/")
    if res.status_code == 200 and len(res.json()) > 0:
         print(f"✅ Users can list plans ({len(res.json())} found)")
    else:
         print("❌ Failed to list plans")
         return False

    print("\n🎉 All content permissions verified!")
    return True

if __name__ == "__main__":
    verify_content_creation()
