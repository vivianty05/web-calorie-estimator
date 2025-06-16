from fastapi import FastAPI
from app import models
from app.database import engine, SessionLocal
from sqlalchemy.orm import Session
from app.routes import router
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()       # To load the environment variables (put this before the app initialization)

app = FastAPI()
models.Base.metadata.create_all(bind=engine)        # This will create all the tables and columns in our postgres if not yet exist
app.include_router(router)      # register all routes from routes.py here

# Defining the URL that can access this backend
origins = [
    "http://localhost:3000",
    "http://192.168.0.224:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            # Allow frontend to talk to backend
    allow_credentials=True,           # Allow cookies, auth headers, etc.
    allow_methods=["*"],              # Allow all HTTP methods: GET, POST, PUT...
    allow_headers=["*"]               # Allow all custom headers
)

# Seeding logic runs once at startup
@app.on_event("startup")
def adding_predefined_unit_list():
    db: Session = SessionLocal()
    default_units = {
        "g": "grams",
        "ml": "milliliters",
        "tbsp":"tablespoon",
        "tsp":"teaspoon"
    }

    for name, description in default_units.items():
        exists = db.query(models.IngredientUnit).filter(models.IngredientUnit.name == name).first()
        if not exists:
            db.add(models.IngredientUnit(name=name, description=description))

    db.commit()
    db.close()