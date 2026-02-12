from app.db.session import SessionLocal
from app.crud import crud_user
from app.schemas.user import UserCreate
from app.models.user import UserRole
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_db():
    db = SessionLocal()
    
    # Create Coach
    coach_email = "coach@example.com"
    coach = crud_user.get_user_by_email(db, email=coach_email)
    if not coach:
        user_in = UserCreate(
            email=coach_email,
            password="password123",
            name="Coach Mario",
            role="coach" # This matches UserRole.COACH value "coach"
        )
        crud_user.create_user(db, user=user_in)
        logger.info(f"Coach created: {coach_email} / password123")
    else:
        logger.info(f"Coach already exists: {coach_email}")

    # Create Client
    client_email = "client@example.com"
    client = crud_user.get_user_by_email(db, email=client_email)
    if not client:
        user_in = UserCreate(
            email=client_email,
            password="password123",
            name="Client Luigi",
            role="client"
        )
        crud_user.create_user(db, user=user_in)
        logger.info(f"Client created: {client_email} / password123")
    else:
        logger.info(f"Client already exists: {client_email}")

    db.close()

if __name__ == "__main__":
    print("Creating initial data...")
    init_db()
    print("Initial data created.")
