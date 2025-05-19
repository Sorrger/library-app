import enum

class EditionStatus(enum.Enum):
    RESERVATION = "reservation"
    AVAILABLE = "available"
    BORROWED = "borrowed"
    LOST = "lost"