import requests

BASE_URL = 'http://localhost:8000/api'

# 1. Register User
print("Registering User...")
r = requests.post(f"{BASE_URL}/auth/register", json={
    "name": "Test Form", "email": "testform@inst.edu", "username": "testform", "password": "JGFAMSYAGF"
})
print(r.status_code, r.json())

# 2. Login User
print("\nLogging in User...")
r = requests.post(f"{BASE_URL}/auth/login", json={
    "username": "testform", "password": "JGFAMSYAGF"
})
token = r.json().get('access_token')
headers = {'Authorization': f'Bearer {token}'}
print(r.status_code, "Token acquired")

# 3. Create Complaint
print("\nCreating Complaint...")
r = requests.post(f"{BASE_URL}/complaints", json={
    "title": "Test Title", "category": "Technical", "priority": "High", "description": "Testing from script"
}, headers=headers)
print(r.status_code, r.json())
comp_id = r.json().get('db_id')

# 4. Login Admin
print("\nLogging in Admin...")
r = requests.post(f"{BASE_URL}/auth/login", json={
    "username": "admin", "password": "admin123"
})
admin_token = r.json().get('access_token')
admin_headers = {'Authorization': f'Bearer {admin_token}'}

# 5. Fetch all complaints
print("\nAdmin Fetching Complaints...")
r = requests.get(f"{BASE_URL}/complaints", headers=admin_headers)
print(r.status_code, f"Count: {len(r.json())}")

# 6. Admin Update Status
print("\nAdmin Updating Status...")
r = requests.put(f"{BASE_URL}/complaints/{comp_id}/status", json={"status": "Resolved"}, headers=admin_headers)
print(r.status_code, r.json())
