from .database import engine, Base

def create_tables():
    try:
        Base.metadata.create_all(bind=engine)
        print("All tables created successfully!")
    except Exception as e:
        print(f"Error creating tables: {e}")
