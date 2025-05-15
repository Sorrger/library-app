import enum

class EditionStatus(enum.Enum):
    AVAILABLE = "available"
    BORROWED = "borrowed"
    LOST = "lost"