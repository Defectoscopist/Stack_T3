# 🔁 BRIDGE.md — «мост» между сессиями и компьютерами

Этот файл — единая точка переноса контекста, чтобы ассистент (я) на **любом компьютере** мог
сразу понять: где мы, что сделано, что делать дальше. Пользователь ведёт его по своей команде.

---

## 📌 ПРОТОКОЛ ИСПОЛЬЗОВАНИЯ

**Пользователь (по команде «обнови BRIDGE»):**
1. Впиши в раздел «7. Журнал сессий» строку: дата + что сделали + следующий шаг.
2. Поправь раздел «5. Что дальше / TODO» (отметь сделанное, добавь новое).
3. Если менялось ключевое решение — коротко допиши в раздел «3. Ключевые решения».

**Ассистент (каждый раз на новом компе / новой сессии):**
1. **Сначала прочитай `BRIDGE.md` целиком** — это приоритетнее любых других источников.
2. Сведи с фактическим состоянием репозитория (`git status`, `npm run check`).
3. Предложи/спроси, что делаем дальше (из раздела 5), и действуй.
4. Если заметил расхождение «файл ↔ реальность» — сообщи пользователю и скорректируй файл.

---

## 1. О ПРОЕКТЕ

**Интернет-магазин одежды «SHOP»** на T3 Stack (пет-проект, ведётся с AI-ассистентом).

- **Стек:** Next.js 15 (App Router) + React 19 + TypeScript (strict) + tRPC v11 + Prisma 6 (MySQL) + NextAuth v5 + Zod + Tailwind CSS v4.
- **Команда запуска:** `npm run dev` (порт 3000). Сборка: `npm run build`.
- **Структура:** `src/app` (роуты/UI), `src/server/api/routers` (tRPC), `src/server/services` (бизнес-логика), `src/server/schemas` (Zod), `src/server/auth`, `prisma/`, `e2e/`, `generated/prisma/`.
- **Назначение:** демо-магазин + админка. Дашборд виден всем залогиненным, менять может только `ADMIN`.

---

## 2. КОМАНДЫ (быстро)

| Команда | Что делает |
|---|---|
| `npm run dev` | dev-сервер |
| `npm run build` | прод-сборка (гоняет lint + typecheck) |
| `npm run check` | `next lint && tsc --noEmit` (всё зелёное = ок) |
| `npm test` / `npm run test:watch` / `npm run test:coverage` | Unit-тесты (Vitest) |
| `npm run test:e2e` | E2E (Playwright, нужен `npx playwright install chromium`) |
| `npm run depcruise` | Проверка зависимостей (dependency-cruiser) |
| `npm run db:push` / `db:migrate` / `db:seed` / `db:studio` | Prisma/БД |
| `npx prisma generate` | Регенерация клиента (и в `postinstall`) |

---

## 3. КЛЮЧЕВЫЕ РЕШЕНИЯ / КОНВЕНЦИИ (что «в голове»)

- **ID в БД — `cuid()`, НЕ uuid** → во входных схемах Zod использовать `z.string().min(1)`, а НЕ `uuid()`.
- **Путь-алиас:** `~/*` → `./src/*` (задан в `tsconfig.json` и продублирован в `vitest.config.ts`).
- **Ошибки:** сервисы бросают `TRPCError` с корректными кодами (`NOT_FOUND`, `CONFLICT`, `FORBIDDEN`), а не `new Error`.
- **env:** переменные валидируются в `src/env.js` (@t3-oss/env-nextjs). OAuth-провайдеры (GitHub/Google/VK/Yandex) — optional; включаются условно, если заполнены и ID и SECRET.
- **Auth:** убран `allowDangerousEmailAccountLinking`. Безопасно.
- **Права (админка):** `getAll*`/`getDashboardStats` — доступны любому авторизованному (демо-решение, осознанно). Все мутации — только `ADMIN` (`adminProcedure` → `FORBIDDEN`).
- **tRPC:** роуты в `routers/`, объединены в `src/server/api/root.ts`.
- **Тесты:** unit — рядом с кодом `src/**/*.test.ts`; E2E — `e2e/*.spec.ts`. Без БД (моки Prisma).
- **Lint:** в `eslint.config.js` есть **документированный override для legacy-файла `src/app/admin/page.tsx`** (переводит правила `any`/unsafe в `warn`) — НЕ убирать, пока файл не отрефакторин.
- **`generated/prisma/*`** — генерируемое, руками не править.

---

## 4. СТАТУС: ВСЁ ЗЕЛЁНОЕ ✅

- `npm run check` (lint + typecheck) → exit 0
- Unit-тесты (Vitest) → 34/34
- E2E (Playwright) → 3/3
- `npm run build` → проходит
- `npm run depcruise` → 0 нарушений (97 модулей, 228 зависимостей)
- `.dependency-cruiser.cjs`, `vitest.config.ts`, `playwright.config.ts` — настроены.

### Проект доведён до «мидл» по 4-м заданиям:
1. **Анализ/улучшения** — безопасность (auth, ownership заказов, права админки, TRPCError), баги схем, удалён мёртвый роут `category/(legacy)`, типизирован `admin.service.ts`, линт → зелёный. Итоги: `ANALYSIS.md`.
2. **Тесты** — Vitest (34) + Playwright (3).
3. **CI/CD** — `.github/workflows/ci.yml` (lint → typecheck → unit → e2e → build). **Ещё не запушен — реальный запуск на GitHub не проверен.**
4. **README** — написан.

---

## 5. ЧТО ДАЛЬШЕ / TODO (по приоритету)

> Обновляйте после каждой сессии (галочки + даты в журнале).
> Приоритеты из раздела «8. Оценка как рекрутер» (и `ANALYSIS.md`, раздел 6).

**Этап 1 — «доделать как продукт» (собесово-критичное):**
- [ ] **Задеплоить (Vercel) + запуш** → CI реально зелёный (сейчас только локально).
- [ ] **`npm audit fix`** — 12 CVE (3 critical, 8 high): postcss + sharp; при необходимости обновить Next.
- [ ] **Сузить ПДн-эндпоинты** (`getAllUsers`/`getAllOrders`) + **добавить rate-limiting** на auth.
- [ ] **Заменить `setTimeout`-статусы** на очередь/cron (`order.service.ts`, поле `deliveredAt`).

**Этап 2 — «глубина» (одна нетривиальная фича + чистка):**
- [ ] **Одна сложная фича с trade-off**: чекаут + конкуренция стока + идемпотентная оплата (Stripe test).
- [ ] **Декомпозировать/типизировать `admin/page.tsx`** (1300 строк, `any`; снять ESLint-override в `eslint.config.js`).
- [ ] **Серверная корзина** вместо/вместе с localStorage (убрать mock `stock: 999`).
- [ ] (опц.) Docker-compose, наблюдаемость (Sentry).

**Этап 3 — «web + mobile с одним бэкендом» (цель):**
- [ ] **Expo/React Native-клиент** на том же backend.
- [ ] **Решить контракт**: tRPC для web + OpenAPI/REST-слой (или общий пакет типов) — для мобилки.
- [ ] Показать общий login/каталог/корзину на web + mobile.

**Хвосты / техдолг:**
- [ ] (низкий/опц.) Русская версия README (сейчас англ.).
- [ ] (опц.) Джоба dependency-cruiser в CI (`.github/workflows/ci.yml`).
- [ ] (опц.) Доп. тесты: сервисы `cart/review/wishlist` + E2E «корзина → чекаут».
- [ ] (низкий) Убрать из репо `Снимок экрана ...png`.

---

## 6. ОКРУЖЕНИЕ

- **Путь проекта (этот комп):** `c:\Users\kuzivanov\prj\Repos\Stack_T3\default`
- **Git:** ветка `main`, воркспейс «default».
- **БД:** MySQL 8, `DATABASE_URL` в `.env` (не коммитится). `start-database.sh` — хелпер для поднятия контейнера.
- **Утилита:** Windows PowerShell; `&&` НЕ работает — использовать `;` (в скриптах для этого окружения). Git — `git --no-pager`.
- **Деплой-настройки:** Vercel/Docker описаны в `README.md`.

---

## 7. ЖУРНАЛ СЕССИЙ (заполняется)

| Дата | Что сделано | Следующий шаг |
|---|---|---|
| 17.08.2026 | Задачи 1–4 выполнены (анализ, тесты, CI, README) + настроен dependency-cruiser | См. раздел 5: запушить, затем рефакторинг админки |
| | | |

---

## 8. ОЦЕНКА КАК РЕКРУТЕР — КРАТКО

- **Уровень:** крепкий junior → junior+/ранний middle. Подробно — `ANALYSIS.md`, раздел 6.
- **Сильно:** современный стек, `routers/services/schemas`, типизация tRPC+Zod, гигиена (lint/typecheck/тесты/CI/depcruise), документирование.
- **Слабо / чего не хватает:** нет деплоя/живой ссылки; нет нетривиальной фичи с trade-off; нет очередей/кэша/оплаты/наблюдаемости; корзина в localStorage; `admin/page.tsx` 1300 строк `any`; нет мобильного клиента; E2E только smoke.
- **Уязвимости (проверено):**
  - `npm audit` → **12 CVE (3 critical, 8 high, 1 low)** — postcss, sharp. Начать с `npm audit fix`.
  - `getAllUsers`/`getAllOrders` — ПДн отдаются любому авторизованному (демо-решение; для прода сузить).
  - нет rate-limiting на auth; нет явной `session.strategy` (дефолт NextAuth — JWT).
  - `setTimeout`-симуляция статусов; mock `stock: 999` в корзине.
- **Что НЕ уязвимо:** нет `dangerouslySetInnerHTML`, нет SQL-инъекций (Prisma), секреты не в git; CSRF закрыт.
- **Направление «web + mobile с одним бэкендом» — существует ✓:** Next.js (web) + Expo/React Native (mobile) на общем backend. ⚠️ tRPC заточен под web → для мобилки добавить OpenAPI/REST-слой или общий пакет типов.
- **План роста (3 этапа)** — см. раздел 5: 1) продукт (деплой+CI, audit-fix, сузить ПДн + rate-limit, очередь) → 2) глубина (одна сложная фича: чекаут + сток + оплата; декомпозиция админки) → 3) mobile-клиент.

---

*Поддерживается в актуальном состоянии по команде пользователя. Приоритет чтения для ассистента — выше любых других источников.*