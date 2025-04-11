from .books import router as books_router
from .authors import router as authors_router
from .genres import router as genres_router
from .editions import router as editions_router
from .publishing_houses import router as publishing_houses_router

routers = [
    books_router,
    authors_router,
    genres_router,
    editions_router,
    publishing_houses_router,
]
