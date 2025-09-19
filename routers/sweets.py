# routers/sweets.py
from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
import schemas, models
from routers.auth import get_current_user, get_db, get_current_admin_user
from typing import List

router = APIRouter(
    prefix="/api/sweets",
    tags=['Sweets']
)

@router.get("/", response_model=List[schemas.Sweet])
def get_all_sweets(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    sweets = db.query(models.Sweet).all()
    return sweets

# Add the new POST endpoint
@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.Sweet)
def create_sweet(sweet: schemas.SweetCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    new_sweet = models.Sweet(**sweet.model_dump())
    db.add(new_sweet)
    db.commit()
    db.refresh(new_sweet)
    return new_sweet

@router.put("/{id}", response_model=schemas.Sweet)
def update_sweet(id: int, updated_sweet: schemas.SweetCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    # Find the existing sweet
    sweet_query = db.query(models.Sweet).filter(models.Sweet.id == id)
    sweet = sweet_query.first()
    
    # If the sweet doesn't exist, raise an error
    if sweet is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Sweet not found")
        
    # Update the sweet's details
    sweet_query.update(updated_sweet.model_dump(), synchronize_session=False)
    db.commit()
    
    return sweet_query.first()

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_sweet(id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_admin_user)):
    sweet_query = db.query(models.Sweet).filter(models.Sweet.id == id)
    sweet = sweet_query.first()
    
    if sweet is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Sweet not found")
        
    db.delete(sweet)
    db.commit()
    
    return