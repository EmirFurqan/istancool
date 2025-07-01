"""add slug and show_on_homepage to category

Revision ID: 1e2e58fa2cbd
Revises: 09ff8ad0a441
Create Date: 2025-06-22 15:16:32.666033

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '1e2e58fa2cbd'
down_revision: Union[str, Sequence[str], None] = '09ff8ad0a441'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Sütunları unique kısıtlaması olmadan ekle
    op.add_column('categories', sa.Column('slug', sa.String(), nullable=True))
    op.add_column('categories', sa.Column('show_on_homepage', sa.Boolean(), nullable=False, server_default=sa.text('false')))

    # Mevcut veriler için slug'ları oluştur
    op.execute("UPDATE categories SET slug = lower(regexp_replace(name, '\s+', '-', 'g')) WHERE slug IS NULL")

    # slug sütununu non-nullable yap
    op.alter_column('categories', 'slug', nullable=False)
    
    # Şimdi unique index'i oluştur
    op.create_index(op.f('ix_categories_slug'), 'categories', ['slug'], unique=True)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f('ix_categories_slug'), table_name='categories')
    op.drop_column('categories', 'show_on_homepage')
    op.drop_column('categories', 'slug')
