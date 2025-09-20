from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import models
from database import engine
from routers import auth, sweets

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS middleware section ---
origins = [
    "http://localhost:5173", # The origin of my React app
    "https://https://incubyte-ivan.vercel.app" # Deployed link

]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Allow all methods
    allow_headers=["*"], # Allow all headers
)
# -----------------------------------------

# Include the routers
app.include_router(auth.router)
app.include_router(sweets.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Sweet Shop API!"}