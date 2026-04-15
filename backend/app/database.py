import importlib
import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from dotenv import find_dotenv, load_dotenv

# Load .env from the working directory or a parent directory if present.
dotenv_path = find_dotenv(usecwd=True)
if dotenv_path:
    load_dotenv(dotenv_path)

DATABASE_URL = os.getenv("DATABASE_URL")
FALLBACK_SQLITE = False
if not DATABASE_URL or DATABASE_URL.strip() in [
    "postgresql+asyncpg://user:password@localhost/db",
    "postgresql+asyncpg://<username>:<password>@<host>:<port>/<database>"
]:
    # Use a local SQLite fallback for development when PostgreSQL is not configured.
    DATABASE_URL = "sqlite+aiosqlite:///./resume_analyzer.db"
    FALLBACK_SQLITE = True
    print(
        "WARNING: DATABASE_URL is not configured or is using placeholder credentials. "
        "Falling back to local SQLite at resume_analyzer.db for development."
    )

if FALLBACK_SQLITE:
    try:
        importlib.import_module("aiosqlite")
    except ModuleNotFoundError as exc:
        raise RuntimeError(
            "Local SQLite fallback requires aiosqlite. Install it with `pip install aiosqlite` "
            "or set a valid PostgreSQL DATABASE_URL in .env."
        ) from exc

engine = create_async_engine(DATABASE_URL, future=True, echo=False)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)
Base = declarative_base()

async def get_session():
    async with AsyncSessionLocal() as session:
        yield session
