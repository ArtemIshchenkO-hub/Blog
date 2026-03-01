    Tables

    1. users (one to many)
    id (PK)
    email (uniquote)
    password_hash
    role
    is_activated
    created_at
    updated_at

    2. user_information (one to one)
    id(PK)
    user_id (FK -> users.id)
    first_name
    last_name
    city_from
    abouth_me
    created_at
    updated_at

    3. posts (many to one)
    id(PK)
    author_id(FK -> users.id)
    title
    content
    status (PENDING, APPROVED, REJECTED)
    created_at
    updated_at

    4. tags
    id(PK)
    tag
    created_at
    updated_at

    5. post_tags (many to many)
    id(PK)
    tag_id(FK -> tags.id)
    post_id(FK-> posts.id)

    6. tokens (one to many)
    id
    user_id (FK -> users.id)
    refresh_token
    created_at
    expires_at

    7. comments
    id
    post_id (FK)
    author_id (FK → users.id)
    content
    created_at
    updated_at
