from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class FoodEntry(Base):      # Creating the first table in our database
    __tablename__ = "food_entries"      # Name of the table

    # Entering the columns in this table
    id = Column(Integer, primary_key=True, index=True)      # index=True here just makes querying for this specific column id faster and optimized
    food_name = Column(String, nullable=False)              # nullable=False here means that the column cannot be left empty in the database
    total_calories = Column(Integer, nullable=True)
    image_path = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)   # If no value given, automatically use the current UTC date and time
    detected_image_path = Column(String, nullable=True)

    ingredients = relationship("Ingredient", back_populates="food")     
    # Establishes a one-to-many relationship between FoodEntry and Ingredient.
    # This means one FoodEntry (a logged meal) can have multiple Ingredient rows.
    # The 'back_populates="food"' links it to the corresponding 'food' field in the Ingredient model,
    # allowing bidirectional access: 
    # - food_entry.ingredients returns a list of its ingredients,
    # - ingredient.food returns the parent food entry.

class Ingredient(Base):
    __tablename__ = "ingredients"
    id = Column(Integer, primary_key=True, index=True)
    food_id = Column(Integer, ForeignKey("food_entries.id"))
    name = Column(String)
    quantity = Column(Float)
    unit_id = Column(Integer, ForeignKey("units.id"))
    calories = Column(Integer, nullable=True)

    food = relationship("FoodEntry", back_populates="ingredients")
    unit = relationship("IngredientUnit")

class IngredientUnit(Base):
    __tablename__ = "units"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    description = Column(String, nullable=True)             # Explanation of the abbreviation (e.g. g for grams)