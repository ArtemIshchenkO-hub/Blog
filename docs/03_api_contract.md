# API Contract (v1) — Blog/Social MVP

## Загальні правила

### Авторизація (authorization — перевірка, що ти залогінений)

- Access token (access token — короткоживучий токен доступу) передається в заголовку:
  - `Authorization: Bearer <accessToken>`
- Refresh token (refresh token — довгоживучий токен для оновлення access) зберігається в cookie (cookie — кука браузера), обовʼязково:
  - `httpOnly: true` (httpOnly — JS у браузері не може прочитати куку)
  - `secure: true` (у проді, тільки HTTPS)
  - `sameSite: 'strict' або 'lax'`

### Ролі (role — роль користувача)

- GUEST — не залогінений
- USER — звичайний користувач
- ADMIN — адміністратор

### Статус поста

- PENDING — чекає модерації
- APPROVED — видимий у загальній стрічці
- REJECTED — відхилено

### Пагінація (pagination — видача частинами)

- Для списків використовуємо:
  - `limit` — скільки елементів повернути
  - `offset` — скільки пропустити
- Приклад: `?limit=20&offset=0`

### Формат помилок (приклад)

- 400 Bad Request — неправильні дані
- 401 Unauthorized — не залогінений / немає access token
- 403 Forbidden — залогінений, але немає прав
- 404 Not Found — не знайдено
- 409 Conflict — конфлікт (наприклад email вже зайнятий)

---

## AUTH

### 1) POST /api/auth/register

**Access:** GUEST  
**Request body:**

- `email` (string)
- `password` (string)

**Response 200:**

- `user`: { `id`, `email`, `role` }
- `accessToken`: string  
  (Refresh token повертається НЕ в JSON, а записується сервером в httpOnly cookie)

**Errors:**

- 400 — невалідний email/пароль
- 409 — email вже існує

**Notes:**

- Після успіху сервер ставить cookie з refresh token.

### 2) POST /api/auth/login

**Access:** GUEST  
**Request body:**

- `email` (string)
- `password` (string)

**Response 200:**

- `user`: { `id`, `email`, `role` }
- `accessToken`: string  
  (refresh token — у cookie)

**Errors:**

- 400 — невалідні дані
- 401 — email/пароль неправильні

### 3) POST /api/auth/logout

**Access:** USER/ADMIN  
**Request:**

- `Authorization: Bearer <accessToken>`
- cookie з refresh token

**Response 200:**

- `{ ok: true }`

**Errors:**

- 401 — не залогінений

**Notes:**

- Сервер видаляє refresh cookie і видаляє відповідний запис у таблиці tokens.

### 4) GET /api/auth/me

**Access:** USER/ADMIN  
**Request:**

- `Authorization: Bearer <accessToken>`

**Response 200:**

- `user`: { `id`, `email`, `role` }

**Errors:**

- 401 — access token відсутній/прострочений/невалідний

### 5) POST /api/auth/refresh

**Access:** GUEST/USER/ADMIN  
**Request:**

- cookie з refresh token

**Response 200:**

- `user`: { `id`, `email`, `role` }
- `accessToken`: string  
  (сервер може видати новий refresh token і перезаписати cookie)

**Errors:**

- 401 — refresh token відсутній/прострочений/невалідний

**Notes:**

- Це ручка для автоматичного перевипуску access токена, коли він “помер”.

---

## POSTS

### 6) GET /api/posts?limit=&offset=

**Access:** GUEST/USER/ADMIN  
**Request query:**

- `limit` (number, default 20)
- `offset` (number, default 0)

**Response 200:**

- `items`: масив постів:
  - { `id`, `author`: { `id`, `email` }, `title`, `content`, `status`, `createdAt` }
- `total`: number

**Rules:**

- GUEST бачить тільки `APPROVED`
- USER бачить тільки `APPROVED` (у загальній стрічці)
- ADMIN може бачити всі або тільки APPROVED (вирішується політикою; для MVP можна всі)

**Errors:**

- 400 — якщо limit/offset некоректні

### 7) GET /api/users/:id/posts?limit=&offset=

**Access:** USER/ADMIN  
**Request params:**

- `id` — userId

**Request query:**

- `limit`, `offset`

**Response 200:**

- `items`: масив постів конкретного юзера
- `total`: number

**Rules:**

- GUEST НЕ має доступу (за твоєю умовою)
- USER:
  - якщо дивиться ЧУЖОГО юзера: повертаємо тільки APPROVED
  - якщо дивиться СЕБЕ: повертаємо всі свої (PENDING/APPROVED/REJECTED)
- ADMIN: може бачити всі

**Errors:**

- 401 — не залогінений
- 404 — користувача не знайдено

### 8) POST /api/posts

**Access:** USER/ADMIN  
**Request:**

- `Authorization: Bearer <accessToken>`

**Request body:**

- `title` (string, optional)
- `content` (string)

**Response 200:**

- `post`: { `id`, `authorId`, `title`, `content`, `status`, `createdAt` }

**Rules:**

- USER створює пост зі статусом `PENDING`
- ADMIN створює пост зі статусом `APPROVED`

**Errors:**

- 401 — не залогінений
- 400 — content порожній або задовгий

### 9) PATCH /api/posts/:id

**Access:** USER/ADMIN  
**Request:**

- `Authorization: Bearer <accessToken>`

**Request body (можна частково):**

- `title` (optional)
- `content` (optional)

**Response 200:**

- `post`: оновлений пост

**Rules:**

- Редагувати може тільки автор поста
- ADMIN редагує тільки свої (як ти задав)

**Errors:**

- 401 — не залогінений
- 403 — не автор
- 404 — пост не знайдено

### 10) DELETE /api/posts/:id

**Access:** USER/ADMIN  
**Request:**

- `Authorization: Bearer <accessToken>`

**Response 200:**

- `{ ok: true }`

**Rules:**

- Автор може видалити свій пост
- ADMIN може видалити будь-який пост

**Errors:**

- 401 — не залогінений
- 403 — не автор (для USER)
- 404 — пост не знайдено

---

## MODERATION (ADMIN)

### 11) GET /api/admin/posts?status=&limit=&offset=

**Access:** ADMIN  
**Request:**

- `Authorization: Bearer <accessToken>`
  **Query:**
- `status` (PENDING/APPROVED/REJECTED)
- `limit`, `offset`

**Response 200:**

- `items`, `total`

**Errors:**

- 401 — не залогінений
- 403 — не адмін

### 12) PATCH /api/admin/posts/:id/approve

**Access:** ADMIN  
**Request:**

- `Authorization: Bearer <accessToken>`

**Response 200:**

- `post`: пост зі статусом `APPROVED`

**Errors:**

- 401/403/404

### 13) PATCH /api/admin/posts/:id/reject

**Access:** ADMIN  
**Request:**

- `Authorization: Bearer <accessToken>`

**Request body (optional):**

- `reason` (string)

**Response 200:**

- `post`: пост зі статусом `REJECTED`

**Errors:**

- 401/403/404

---

## COMMENTS

### 14) GET /api/posts/:id/comments?limit=&offset=

**Access:** USER/ADMIN  
**Request:**

- `Authorization: Bearer <accessToken>`

**Response 200:**

- `items`: масив коментарів:
  - { `id`, `postId`, `author`: { `id`, `email` }, `content`, `createdAt` }
- `total`

**Rules:**

- GUEST не має доступу

**Errors:**

- 401 — не залогінений
- 404 — пост не знайдено

### 15) POST /api/posts/:id/comments

**Access:** USER/ADMIN  
**Request:**

- `Authorization: Bearer <accessToken>`

**Request body:**

- `content` (string)

**Response 200:**

- `comment`: { `id`, `postId`, `authorId`, `content`, `createdAt` }

**Errors:**

- 401 — не залогінений
- 400 — content порожній
- 404 — пост не знайдено

### 16) PATCH /api/comments/:id

**Access:** USER/ADMIN  
**Request:**

- `Authorization: Bearer <accessToken>`

**Request body:**

- `content` (string)

**Response 200:**

- `comment`: оновлений коментар

**Rules:**

- Редагувати може тільки автор коментаря
- ADMIN редагує тільки свої (за твоєю умовою)

**Errors:**

- 401/403/404

### 17) DELETE /api/comments/:id

**Access:** USER/ADMIN  
**Request:**

- `Authorization: Bearer <accessToken>`

**Response 200:**

- `{ ok: true }`

**Rules:**

- Автор може видалити свій коментар
- ADMIN може видалити будь-який коментар

**Errors:**

- 401/403/404
