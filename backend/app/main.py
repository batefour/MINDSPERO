from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import get_settings
from app.database import engine, Base
from app.routes import auth, users, documents, payments, admin

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
settings = get_settings()

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.API_VERSION,
    description="Scalable Python + FastAPI backend for AI Education Platform",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(documents.router)
app.include_router(payments.router)
app.include_router(admin.router)


@app.get("/health", tags=["Health"])
def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.API_VERSION,
    }


@app.get("/", tags=["Root"])
def root():
    """Root endpoint"""
    return {
        "message": "Welcome to AI Education Platform",
        "app": settings.APP_NAME,
        "docs": "/docs",
        "openapi_schema": "/openapi.json",
    }


# Exception handlers
from fastapi import Request
from fastapi.responses import JSONResponse


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error",
            "error": str(exc) if settings.DEBUG else "An error occurred",
        },
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
