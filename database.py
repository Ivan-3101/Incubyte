# database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker


# Put this line in your database.py file
# NEW corrected line
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:ivands3101$@localhost/sweetshop"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()