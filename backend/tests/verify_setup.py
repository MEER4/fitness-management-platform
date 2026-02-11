import sys
import os
import asyncio

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

def check_imports():
    print("Checking imports...")
    try:
        from app.main import app
        print("✅ app.main imported successfully")
        from app.models import User, Plan, Subscription, Workout, UserWorkout, Progress
        print("✅ app.models imported successfully")
        from app.core.config import settings
        print(f"✅ Settings loaded. DB URL: {settings.DATABASE_URL}")
    except Exception as e:
        print(f"❌ Import failed: {e}")
        sys.exit(1)

def check_alembic():
    print("\nChecking Alembic...")
    import subprocess
    # Get the backend directory (parent of tests directory)
    backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    try:
        # Run alembic upgrade head using backend_dir as cwd
        result = subprocess.run(["alembic", "upgrade", "head"], cwd=backend_dir, capture_output=True, text=True)
        if result.returncode == 0:
            print("✅ Alembic upgrade head successful")
        else:
            print(f"❌ Alembic upgrade failed:\n{result.stderr}")
            sys.exit(1)
    except Exception as e:
        print(f"❌ Alembic check failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    check_imports()
    check_alembic()
    print("\n🎉 All checks passed!")
