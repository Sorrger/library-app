import enum

class EditionStatus(enum.Enum):
    RESERVED = "reserved"
    AVAILABLE = "available"
    BORROWED = "borrowed"
    LOST = "lost"

class FineTypeEnum(str, enum.Enum):
    damage = "damage"
    lost = "lost"
    late = "late"
