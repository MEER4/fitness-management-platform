from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api import deps
from app.models.user import User, UserRole
from app.crud import crud_subscription
from app.schemas.subscription import Subscription, SubscriptionCreate

router = APIRouter()

@router.get("/me", response_model=List[Subscription])
def read_my_subscription(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get current user's active subscription.
    """
    return current_user.subscriptions

@router.post("/request", response_model=Subscription)
def request_subscription(
    *,
    db: Session = Depends(deps.get_db),
    subscription_in: SubscriptionCreate,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Request a subscription to a plan.
    """
    # Check if user already has a pending or active subscription to this plan? 
    # For now, allow multiple requests or check logic later.
    subscription = crud_subscription.create(
        db, 
        user_id=current_user.id, 
        plan_id=subscription_in.plan_id,
        status="pending"
    )
    return subscription

@router.get("/pending", response_model=List[Subscription])
def read_pending_subscriptions(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get all pending subscriptions. Coach only.
    """
    if current_user.role != UserRole.COACH:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    
    subscriptions = crud_subscription.get_by_status(db, status="pending")
    return subscriptions

@router.post("/{id}/approve", response_model=Subscription)
def approve_subscription(
    id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Approve a subscription. Coach only.
    """
    if current_user.role != UserRole.COACH:
        raise HTTPException(status_code=400, detail="Not enough permissions")
        
    subscription = crud_subscription.get(db, id=id)
    if not subscription:
        raise HTTPException(status_code=404, detail="Subscription not found")
        
    subscription = crud_subscription.update_status(db, db_obj=subscription, status="active")
    return subscription

@router.post("/{id}/reject", response_model=Subscription)
def reject_subscription(
    id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Reject a subscription. Coach only.
    """
    if current_user.role != UserRole.COACH:
        raise HTTPException(status_code=400, detail="Not enough permissions")
        
    subscription = crud_subscription.get(db, id=id)
    if not subscription:
        raise HTTPException(status_code=404, detail="Subscription not found")
        
    subscription = crud_subscription.update_status(db, db_obj=subscription, status="rejected")
    return subscription
