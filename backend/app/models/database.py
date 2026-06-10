"""
SQLite database setup with SQLAlchemy for CarbonWise AI.

Architecture supports easy migration to PostgreSQL or other databases
by changing the DATABASE_URL connection string.
"""

import json
from datetime import datetime, timezone

from sqlalchemy import (
    Column,
    DateTime,
    Float,
    Integer,
    String,
    Text,
    Boolean,
    create_engine,
)
from sqlalchemy.orm import DeclarativeBase, sessionmaker


DATABASE_URL = "sqlite:///./carbonwise.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    """Base class for all database models."""
    pass


class ProgressSnapshotDB(Base):
    """Stores historical carbon footprint snapshots for progress tracking."""

    __tablename__ = "progress_snapshots"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    session_id = Column(String(100), index=True, nullable=False)
    timestamp = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )
    total_emissions = Column(Float, nullable=False)  # Annual tonnes CO2
    carbon_score = Column(Integer, nullable=False)
    breakdown_json = Column(Text, nullable=False)  # JSON-serialized breakdown

    @property
    def breakdown(self) -> dict:
        """Deserialize breakdown JSON."""
        return json.loads(self.breakdown_json) if self.breakdown_json else {}

    @breakdown.setter
    def breakdown(self, value: dict):
        """Serialize breakdown to JSON."""
        self.breakdown_json = json.dumps(value)


class ReductionGoalDB(Base):
    """Stores user reduction goals."""

    __tablename__ = "reduction_goals"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    session_id = Column(String(100), unique=True, index=True, nullable=False)
    target_reduction_percent = Column(Float, nullable=False)
    target_date = Column(String(50), nullable=True)
    created_at = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )
    is_achieved = Column(Boolean, default=False)


def init_db():
    """Create all database tables."""
    Base.metadata.create_all(bind=engine)


def get_db():
    """Dependency for FastAPI route injection."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
