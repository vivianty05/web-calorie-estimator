import httpx        # This library is like 'requests' but it supports async so it fits FastAPI and it is to make the HTTP request
import os           # This lets you access environment variables which is better than hardcoding
from fastapi import HTTPException
from dotenv import load_dotenv

load_dotenv()

EDAMAM_APP_ID = os.getenv("EDAMAM_APP_ID")
EDAMAM_APP_KEY = os.getenv("EDAMAM_APP_KEY")

unit_map = {
    "g": "Gram",
    "ml": "Milliliter",
    "tbsp": "Tablespoon",
    "tsp": "Teaspoon",
    "cup": "Cup",
    "oz": "Ounce",
    "lbs": "Pound"
}

async def get_calories_per_ingredient(ingredient_name: str, unit: str, quantity: float) -> float:      # Takes the food name as a string and return a float value for the calories
    url = "https://api.edamam.com/api/food-database/v2/parser"
    params = {
        "app_id": EDAMAM_APP_ID,
        "app_key": EDAMAM_APP_KEY,
        "ingr": ingredient_name
    }

    async with httpx.AsyncClient() as client:                   # makes the request to Edamam's server
        parser_response = await client.get(url, params=params)         # .get() sends a GET request with the parameters
        parser_data = parser_response.json()                                  # turns the reply into a Python dictionary

    # 🔍 DEBUG: Show what the parser returned
    print("PARSER RESPONSE:")
    print(parser_data)

    try: 
        # Use the first hint instead of parsed
        hint = parser_data["hints"][0]
        food = hint["food"]
        food_id = food["foodId"]
        measures = hint["measures"]

        if unit not in unit_map:
            raise HTTPException(status_code=400, detail="Unsupported unit.")
        
        edamam_label = unit_map[unit]
        matched_measure = next ((m for m in measures if m["label"].lower() == edamam_label.lower()), None)

        if not matched_measure:
            raise HTTPException(status_code=400, detail=f"'{edamam_label}' not available for '{ingredient_name}'")
        
        # get nutrients
        nutrients_url = "https://api.edamam.com/api/food-database/v2/nutrients"
        body = {
            "ingredients": [{
                "foodId": food_id,
                "measureURI": matched_measure["uri"],
                "quantity": quantity
            }]
        }

        # 🔍 DEBUG: Show what we’re sending to the nutrients endpoint
        print("NUTRIENT REQUEST BODY:")
        print(body)

        async with httpx.AsyncClient() as client:
            nutrient_response = await client.post(nutrients_url, json=body, params=params)
            nutrient_data = nutrient_response.json()

        # 🔍 DEBUG: Show what the nutrient API returned
        print("NUTRIENT RESPONSE:")
        print(nutrient_data)

        return nutrient_data["calories"]

    except (KeyError, IndexError) as e:                         # if the API doesn't find anything or the JSON is missing expected keys
        print(f"Error while parsing Edamam response: {type(e).__name__} - {str(e)}")    
        return 0.0                                              # return 0 so the app doesn't crash
    
