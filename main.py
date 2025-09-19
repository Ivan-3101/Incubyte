from fastapi import FastAPI
import models
from database import engine
from routers import auth, sweets # Import the new router

# This command tells SQLAlchemy to create all the tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Include the authentication router
app.include_router(auth.router)
app.include_router(sweets.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Sweet Shop API!"}