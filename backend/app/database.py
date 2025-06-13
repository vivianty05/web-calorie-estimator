from sqlalchemy import create_engine        # Connects SQLAlchemy to the PostgreSQL database
from sqlalchemy.orm import sessionmaker     # Creates sessions to run DB commands
from sqlalchemy.ext.declarative import declarative_base     # Base class used by SQLAlchemy to define models (tables)

DATABASE_URL = "postgresql://postgres:Theodora1234#!@localhost:5432/FoodCalorieCounterWeb"      # Establishing connection with db using the URL

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():                   # Create a connection to the database
    db = SessionLocal()
    try:                        # Try something because it can fail
        yield db                # Try to open it
    finally:
        db.close()              # No matter what we will also close the connection