from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel      # Define data schemas for cleaner validation, parsing, and documentation, good for error handling and API docs
from typing import List, Annotated, Literal
from app import models
from app.database import engine, SessionLocal
from sqlalchemy.orm import Session

app = FastAPI()
models.Base.metadata.create_all(bind=engine)        # This will create all the tables and columns in our postgres

class IngredientBase(BaseModel):
    name: str
    quantity: float
    unit: Literal["g", "ml", "pcs", "tbsp", "tsp"]      # Might need an additional database table, but for now this will do
    calories: int

class FoodEntryBase(BaseModel):
    food_name: str
    total_calories: int
    ingredients: List[IngredientBase]

def get_db():                   # Create a connection to the database
    db = SessionLocal()
    try:                        # Try something because it can fail
        yield db                # Try to open it
    finally:
        db.close()              # No matter what we will also close the connection

# Writing API endpoints for our whole FastAPI application
        
db_dependency = Annotated[Session, Depends(get_db)]     # A shortcut for injecting a database session

@app.post("/enter-food/")
async def enter_food(foodentry: FoodEntryBase, db: db_dependency):      # Passing a data validation to our API request, then create a connection between the FastAPI app and db
    try:                    # Use try so that it doesn't give duplicate entries in the food_entries table
        db_food = models.FoodEntry(
            food_name=foodentry.food_name, 
            total_calories=foodentry.total_calories
        )
        db.add(db_food)
        db.flush()          # Get db_food.id without committing

        
        for ingredient in foodentry.ingredients:
            db_ingredient = models.Ingredient(
                name=ingredient.name, 
                quantity=ingredient.quantity, 
                unit=ingredient.unit, 
                calories=ingredient.calories, 
                food_id=db_food.id
            )
            db.add(db_ingredient)

        db.commit()
        db.refresh(db_food)
        return {"message": "Entry saved"}
    
    except Exception as e:
        db.rollback()       # Cancel the transaction if anything fails
        print("Error:", e)
        raise HTTPException(status_code=500, detail="Something went wrong.")           # Where does this show up?
