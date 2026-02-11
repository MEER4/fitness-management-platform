from typing import Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api import deps
from app.crud import crud_progress
from app.schemas.progress import Progress, ProgressCreate
from app.models.user import User

router = APIRouter()

@router.post("/", response_model=Progress)
def create_progress(
    *,
    db: Session = Depends(deps.get_db),
    progress_in: ProgressCreate,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Log progress for the current user.
    """
    progress = crud_progress.create_progress(db, obj_in=progress_in, user_id=current_user.id)
    return progress

@router.get("/me", response_model=List[Progress])
def read_my_progress(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get current user's progress history.
    """
    progress = crud_progress.get_by_user(db, user_id=current_user.id)
    return progress

@router.get("/{user_id}", response_model=List[Progress])
def read_user_progress(
    user_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get progress history of a specific user.
    """
    if current_user.id != user_id and current_user.role != "coach":
        # Usually 403 Forbidden is better for permissions, but 400 is fine if consistent
        raise HTTPException(
            status_code=403, detail="The user doesn't have enough privileges"
        )
    progress = crud_progress.get_by_user(db, user_id=user_id)
    return progress
