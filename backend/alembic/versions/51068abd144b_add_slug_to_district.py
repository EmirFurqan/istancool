"""add slug to district

Revision ID: 51068abd144b
Revises: bc3932df357b
Create Date: 2025-06-22 16:06:06.738990

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '51068abd144b'
down_revision: Union[str, Sequence[str], None] = 'bc3932df357b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # 1. Slug sütununu nullable olarak ekle
    op.add_column('districts', sa.Column('slug', sa.String(), nullable=True))
    # 2. Mevcut veriler için slug üret
    op.execute("UPDATE districts SET slug = lower(regexp_replace(name, '\\s+', '-', 'g')) WHERE slug IS NULL")
    # 3. Slug sütununu NOT NULL yap
    op.alter_column('districts', 'slug', nullable=False)
    # 4. Unique index ekle
    op.create_index(op.f('ix_districts_slug'), 'districts', ['slug'], unique=True)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f('ix_districts_slug'), table_name='districts')
    op.drop_column('districts', 'slug')
