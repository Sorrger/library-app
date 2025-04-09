from pydantic import BaseModel

class AuthorBase(BaseModel):
    name: str    
    surname: str

class AuthorCreate(AuthorBase):
    pass

class Author(AuthorBase):
    author_id: int

    class Config:
        orm_mode = True