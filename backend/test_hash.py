from passlib.context import CryptContext
try:
    pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")
    hash = pwd_context.hash("password")
    print(f"Hash success: {hash}")
    verify = pwd_context.verify("password", hash)
    print(f"Verify success: {verify}")
except Exception as e:
    print(f"Error: {e}")

from jose import jwt
from datetime import datetime, timedelta

SECRET_KEY = "test_secret"
ALGORITHM = "HS256"

try:
    to_encode = {"exp": datetime.utcnow() + timedelta(minutes=15), "sub": "test@example.com"}
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    print(f"JWT success: {encoded_jwt}")
except Exception as e:
    print(f"JWT Error: {e}")
