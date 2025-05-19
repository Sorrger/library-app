import enum

class EditionStatus(enum.Enum):
    AVAILABLE = "available"
    RESERVATION = "reservation"
    BORROWED = "borrowed"
    LOST = "lost"