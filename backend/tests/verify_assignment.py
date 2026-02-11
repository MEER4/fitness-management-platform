
import sys
import os
import requests
import json
from datetime import datetime

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

BASE_URL = "http://localhost:8000"

COACH_USER = {
    "email": "coach@example.com",
    "password": "password123"
}

CLIENT_USER = {
    "email": "client@example.com",
    "password": "password123"
}

def get_token(user_data):
    login_data = {
        "username": user_data["email"],
        "password": user_data["password"]
    }
    response = requests.post(f"{BASE_URL}/auth/login", data=login_data)
    if response.status_code == 200:
        return response.json().get("access_token")
    return None

def verify_assignment_logic():
    print("Getting tokens...")
    coach_token = get_token(COACH_USER)
    client_token = get_token(CLIENT_USER)
    
    if not coach_token or not client_token:
        print("❌ Failed to get tokens (Users might not exist, run verify_content.py first)")
        return False
        
    print("✅ Tokens received")
    
    # Prerequisite: We need a user_id for the client and a workout_id
    # We'll fetch the client profile or just use a known ID if we had one.
    # Actually, to get client ID, we could implement /users/me or just rely on a known ID.
    # Since we don't have /users/me exposed broadly or easy lookup, let's assume
    # we can search or re-register. 
    # Wait, I don't have a way to get the Client's ID easily as Coach without a User List endpoint.
    # But I can cheat: I know the client email. I can add a helper or just try ID 1, 2.
    # Or, better, I'll use the CLI to look it up? No.
    # I'll add a helper function to `verify_assignment.py` to get user ID by specific means if possible?
    # No, I should probably rely on `verify_content.py` having run.
    # Let's assume Client is ID 2 (Coach 1, Client 2) based on creation order in previous script.
    
    # Also need a workout ID. Start by listing workouts as Coach.
    headers_coach = {"Authorization": f"Bearer {coach_token}"}
    headers_client = {"Authorization": f"Bearer {client_token}"}
    
    print("\n[COACH] Listing Workouts...")
    res = requests.get(f"{BASE_URL}/workouts/", headers=headers_coach)
    workouts = res.json()
    if not workouts:
        print("❌ No workouts found (Run verify_content.py first)")
        return False
    workout_id = workouts[0]["id"]
    print(f"✅ Found workout ID: {workout_id}")
    
    # We need the client's ID. Since we can't easily fetch it via API (no list users),
    # I will try to hit a protected endpoint /users/me if it existed.
    # For now, I'll brute force assume ID 2, or 1.
    # Actually, `get_current_user` returns the user object.
    # I'll create a temporary helper endpoint `GET /auth/me`? No, I shouldn't modify code just for test.
    # I'll assumes Client is ID 2 (as created by verify_content.py).
    # If not, this might fail.
    # Get Client ID dynamically
    from app.api.deps import SessionLocal
    from app.crud import crud_user
    db = SessionLocal()
    client_user_db = crud_user.get_user_by_email(db, email=CLIENT_USER["email"])
    if not client_user_db:
        print(f"❌ Client user {CLIENT_USER['email']} not found in DB")
        return False
    client_id = client_user_db.id
    print(f"✅ Found Client ID: {client_id}")
    db.close() 
    
    # 1. Coach assigns Workout to Client
    print(f"\n[COACH] Assigning Workout {workout_id} to User {client_id}...")
    assign_data = {
        "user_id": client_id,
        "workout_id": workout_id
    }
    res = requests.post(f"{BASE_URL}/user-workouts/", json=assign_data, headers=headers_coach)
    if res.status_code == 200:
        print("✅ Assignment successful")
    elif res.status_code == 403: # Maybe ID doesn't exist? or constraint?
         print(f"❌ Assignment failed (403): {res.text}")
         return False
    else:
        print(f"❌ Assignment failed: {res.status_code} {res.text}")
        return False

    # 2. Client views their workouts
    print("\n[CLIENT] Checking Assigned Workouts...")
    res = requests.get(f"{BASE_URL}/user-workouts/me", headers=headers_client)
    if res.status_code == 200:
        my_workouts = res.json()
        print(f"✅ Client sees {len(my_workouts)} workouts")
        # Check if our workout is there
        found = any(w['workout_id'] == workout_id for w in my_workouts)
        if found:
            print("✅ Verified specific workout assignment")
        else:
            print("❌ Assigned workout NOT found in list")
            return False
    else:
        print(f"❌ Failed to get workouts: {res.status_code} {res.text}")
        return False

    # 3. Client Logs Progress
    print("\n[CLIENT] Logging Progress...")
    progress_data = {
        "weight": 75.5,
        "body_fat": 15.2,
        "notes": "Feeling good"
    }
    res = requests.post(f"{BASE_URL}/progress/", json=progress_data, headers=headers_client)
    if res.status_code == 200:
        print("✅ Progress logged")
    else:
        print(f"❌ Failed to log progress: {res.status_code} {res.text}")
        return False

    # 4. Client Views Progress
    print("\n[CLIENT] Viewing Progress History...")
    res = requests.get(f"{BASE_URL}/progress/me", headers=headers_client)
    if res.status_code == 200:
        history = res.json()
        print(f"✅ Progress history retrieved ({len(history)} entries)")
        if len(history) > 0 and history[-1]['weight'] == 75.5:
             print("✅ Verified latest progress entry")
        else:
             print("❌ Latest entry mismatch")
             return False
    else:
        print(f"❌ Failed to get progress: {res.status_code} {res.text}")
        return False

    print("\n🎉 Assignment and Progress verified!")
    return True

if __name__ == "__main__":
    verify_assignment_logic()
