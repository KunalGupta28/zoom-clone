import uuid
from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.orm import Session
from datetime import timedelta
from ..database import get_db
from ..models.user import User
from ..schemas.auth import UserCreate, UserLogin, Token, UserResponse
from ..auth import get_password_hash, verify_password, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES, get_current_user
from ..services.email_service import send_verification_email, send_password_reset_email

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/signup", response_model=UserResponse)
def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    # Check if email exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    hashed_pw = get_password_hash(user_data.password)
    verification_token = str(uuid.uuid4())
    
    new_user = User(
        name=user_data.name,
        email=user_data.email,
        hashed_password=hashed_pw,
        is_verified=False,
        verification_token=verification_token
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Send verification email
    send_verification_email(new_user.email, verification_token)
    
    return new_user

@router.post("/verify-email")
def verify_email(token: str = Body(..., embed=True), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.verification_token == token).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid verification token")
        
    user.is_verified = True
    user.verification_token = None
    db.commit()
    return {"message": "Email verified successfully"}

@router.post("/login", response_model=Token)
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_data.email).first()
    if not user or not user.hashed_password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
        
    if not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
        
    if getattr(user, 'is_verified', None) is False:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Please verify your email address before logging in."
        )
        
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/forgot-password")
def forgot_password(email: str = Body(..., embed=True), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        # Don't leak if user exists
        return {"message": "If that email is in our system, we have sent a password reset link."}
        
    reset_token = str(uuid.uuid4())
    user.reset_token = reset_token
    db.commit()
    
    send_password_reset_email(user.email, reset_token)
    return {"message": "If that email is in our system, we have sent a password reset link."}

@router.post("/reset-password")
def reset_password(token: str = Body(...), new_password: str = Body(...), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.reset_token == token).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")
        
    user.hashed_password = get_password_hash(new_password)
    user.reset_token = None
    db.commit()
    return {"message": "Password has been reset successfully"}

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return current_user
