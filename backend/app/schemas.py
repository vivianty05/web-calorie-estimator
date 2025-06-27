from pydantic import BaseModel, Field      # Define data schemas for cleaner validation, parsing, and documentation, good for error handling and API docs
from typing import List, Optional 
from datetime import datetime

# Base: shared fields (reusable in both directions)

class UnitBase(BaseModel):              # Model for unit selections for user (for response)
    id: int
    name: str
    description: Optional[str]     # Allow it to be empty

    class Config:
        from_attributes = True            # lets Pydantic work with SQLAlchemy objects

# Input model
class IngredientBase(BaseModel):        # Model for ingredients input
    name: str
    quantity: float = Field(gt=0, description="Must be greater than zero")
    unit_id: int = Field(gt=0, description="Must be a valid unit ID")
    unit: str

class FoodEntryReview(BaseModel):         # Model for food input
    id: int
    food_name: str
    ingredients: List[IngredientBase]

# Output model (inherits and adds id )
class IngredientResponse(IngredientBase):   # Model for ingredients output
    id: int
    unit: UnitBase      # nested object showing full unit info
    calories: int

    class Config:
        from_attributes = True

class FoodEntryResponse(FoodEntryReview):     # Model for food output (to show history)
    id: int
    image_path: Optional[str]
    total_calories: Optional[int]
    timestamp: datetime
    ingredients: List[IngredientResponse]
    detected_image_path: Optional[str]

    class Config:
        from_attributes = True