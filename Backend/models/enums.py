import enum

class EditionStatus(enum.Enum):
    RESERVED = "reserved"
    AVAILABLE = "available"
    BORROWED = "borrowed"
    LOST = "lost"