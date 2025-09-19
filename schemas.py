# schemas.py
from pydantic import BaseModel, EmailStr
from pydantic import ConfigDict

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    email: EmailStr

    model_config = ConfigDict(from_attributes=True)


# schemas.py
# ... (keep existing classes)

class Token(BaseModel):
    access_token: str
    token_type: str

class SweetBase(BaseModel):
    name: str
    category: str
    price: float
    quantity: int

class SweetCreate(SweetBase):
    pass

class Sweet(SweetBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

class InventoryUpdate(BaseModel):
    amount: int
