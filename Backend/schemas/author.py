from pydantic import BaseModel

class AuthorBase(BaseModel):
    name: str    
    surrname: str

class AuthorCreate(AuthorBase):
    pass

class Author(AuthorBase):
    author_id: int

    class Config:
        from_attributes = True