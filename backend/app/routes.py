from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form
from typing import Annotated, List
from app import models
from app.database import SessionLocal, get_db
from sqlalchemy.orm import Session
from app.schemas import FoodEntryReview, UnitBase, FoodEntryResponse, IngredientBase
import os, time, shutil
from app.edamam import get_calories_per_ingredient

router = APIRouter()

db_dependency = Annotated[Session, Depends(get_db)]     # A shortcut for injecting a database session

# Writing API endpoints for our whole FastAPI application

@router.post("/upload-image/")
def upload_image(
    db: db_dependency, 
    food_name: str= Form(...), 
    file: UploadFile= File(...)):
    try:
        timestamp = int(time.time())
        extension = file.filename.split(".")[-1]        # extracts the file extension from the uploaded filename to keep the correct format of the image
        filename = f"{timestamp}_{file.filename}"
        image_path = f"images/{filename}"
        os.makedirs("images", exist_ok=True)            # creates the folder images/ if it doesn't exist

        # Save the image
        with open(image_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        food_entry = models.FoodEntry(
            food_name=food_name,
            image_path=image_path
        )
        db.add(food_entry)
        db.flush()
        db.commit()
        db.refresh(food_entry)
        return {
            "message": "Saved",
            "food name": food_entry.food_name,
            "food_entry_id": food_entry.id,
            "image_path": food_entry.image_path
        }
    
    except Exception as e:
        db.rollback()       # Cancel the transaction if anything fails
        print("Upload failed:", e)
        raise HTTPException(status_code=500, detail="Image upload failed.")

@router.post("/submit-review/")
async def submit_food(
    foodentry: FoodEntryReview,       # Passing a data validation to our API request
    db: db_dependency):               # Create a connection between the FastAPI app and db
    try:                              # Use try so that it doesn't give duplicate entries in the food_entries table
        # Fetch existing entry instead of creating new one
        db_food = db.query(models.FoodEntry).filter(models.FoodEntry.id == foodentry.food_name_id).first()
        if not db_food:
            raise HTTPException(status_code=404, detail="Food entry not found")

        # Update food name if user edits it
        db_food.food_name = foodentry.food_name

        total = 0

        for ingredient in foodentry.ingredients:
            # Get calories from API
            kcal = await get_calories_per_ingredient(
                ingredient_name=ingredient.name,
                unit=ingredient.unit,
                quantity=ingredient.quantity
            )
            total += kcal
        
        for ingredient in foodentry.ingredients:
            db_ingredient = models.Ingredient(
                name=ingredient.name, 
                quantity=ingredient.quantity, 
                unit_id=ingredient.unit_id, 
                calories=round(kcal),
                food_id=db_food.id
            )
            db.add(db_ingredient)

        db_food.total_calories = round(total)

        db.commit()
        db.refresh(db_food)

        return {
            "message": "Entry saved",
            "food_entry_id": db_food.id,
            "food_name": db_food.food_name,
            "total_calories": db_food.total_calories
        }
    
    except Exception as e:
        db.rollback()       # Cancel the transaction if anything fails
        print("Error:", e)
        raise HTTPException(status_code=500, detail=f"Something went wrong: {str(e)}")           # Where does this show up?

@router.post("/calculate-calories-per-ingredient/")          # for updating real-time calories per ingredient
async def calculate_single_ingredient(ingredient: IngredientBase):
    kcal = await get_calories_per_ingredient(
        ingredient_name=ingredient.name,
        unit=ingredient.unit,
        quantity=ingredient.quantity
    )
    return {"ingredient": ingredient.name, "calories": round(kcal)}
    
@router.post("/calculate-total-calories/")                   # for updating real-time total calories of food
async def calculate_total_calories(entry: FoodEntryReview):
    total = 0
    per_ingredient = []

    for ing in entry.ingredients:
        kcal = await get_calories_per_ingredient(ing.name, ing.unit, ing.quantity)
        per_ingredient.append({
            "name": ing.name, 
            "unit": ing.unit,
            "quantity": ing.quantity,
            "calories": round(kcal)
            })
        total += kcal

    return {
        "food_name": entry.food_name,
        "ingredients": per_ingredient,
        "total_calories": round(total)
    }

@router.get("/food-entries/", response_model=List[FoodEntryResponse])
def get_all_entries(db: db_dependency):
    entries = db.query(models.FoodEntry).all()
    return entries

@router.get("/search-food-entries", response_model=List[FoodEntryResponse])
def search_entries(
    query: str, 
    db: db_dependency):
    results = db.query(models.FoodEntry).filter(
        models.FoodEntry.food_name.ilike(f"%{query}%")).all()       # ilike allows case-insensitive matching
    return results

@router.get("/food-entries/{entry_id}", response_model=FoodEntryResponse)
def get_entry(
    entry_id: int, 
    db: db_dependency):
    entry = db.query(models.FoodEntry).filter(models.FoodEntry.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    return entry

@router.get("/get-units/", response_model=List[UnitBase])
def get_units(db:db_dependency):
    units = db.query(models.IngredientUnit).all()
    return units

@router.delete("/delete-entry/{entry_id}")
def delete_entry(
    entry_id: int, 
    db: db_dependency):
    entry = db.query(models.FoodEntry).filter(models.FoodEntry.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    db.delete(entry)
    db.commit()
    return {"message": "Food record deleted"}