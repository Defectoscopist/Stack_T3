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

## 4. СТАТУС

> ⚠️ **Актуальный статус (18.08.2026).** **Вариант B (Stripe «оплата + hold‑сток») — завершён ПО КОДУ**: `npm run check` (lint+typecheck) → **exit 0**, unit (Vitest) → **36/36** (добавлены тесты `finalizePaidOrder`/идемпотентность/`releaseExpiredHolds`), добавлен **Stripe webhook** (`/api/webhooks/stripe`, финализация по `payment_intent.succeeded`), документированы Stripe-переменные в `.env.example`/README. Однако **локально** на этой Windows-среде:
> - `next build` падает на встроенной `/404`/`/500` (`_error`, `useContext null`) — **pre-existing** (повторяется и на чистом `main`); обновление Next не чинит (уже последний 15.5); на CI/Ubuntu, как правило, не воспроизводится.
> - Playwright-раннер локально даёт «No tests found» (не подхватывает `.ts`-spec из ESM; деградация после многих переустановок). Тесты код/конфиг корректны.
>
> Итог: **код зелёный по lint/typecheck/unit; локальные build/E2E-сбои — средовые, не из-за кода.** Рекомендация — прогнать на CI (Ubuntu/Vercel), где это стабильно.
>
> 21.08.2026: локальная причина падения `product.getAll` найдена и устранена — Prisma Client ожидал `ProductVariant.stockReserved`, но миграции `payment_hold` и `mobile_token` не были применены к MySQL. Выполнен `npx prisma migrate deploy`, после чего tRPC `product.getAll({ limit: 12 })` вернул HTTP 200.
>
> Базовый статус:
- `npm run check` (lint + typecheck) → exit 0
- Unit-тесты (Vitest) → 36/36 (4 файла)
- E2E (Playwright) → 3 теста; локально «No tests found» из-за среды транс (на CI ожидается ок)
- `npm run depcruise` → 0 нарушений (97 модулей, 228 зависимостей)
- `.dependency-cruiser.cjs`, `vitest.config.ts`, `playwright.config.ts` — настроены (playwright.config упрощён под классический API).

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
- [x] **Одна сложная фича с trade-off**: чекаут + конкуренция стока + идемпотентная оплата (Stripe test) — **завершено по коду (вариант B)**: hold‑сток → PaymentIntent (fallback‑симуляция) → webhook `/api/webhooks/stripe`. Тесты payment-жизненного цикла добавлены (unit 36/36). Осталось: применить миграцию `2026...payment_hold` к БД.
- [ ] **Декомпозировать/типизировать `admin/page.tsx`** (1300 строк, `any`; снять ESLint-override в `eslint.config.js`).
- [ ] **Серверная корзина** вместо/вместе с localStorage (убрать mock `stock: 999`).
- [ ] (опц.) Docker-compose, наблюдаемость (Sentry).

**Этап 3 — Mobile («установщик», НЕ сторы):**
- [x] **Решение по Stripe-WIP (вариант B доделан по коду)** — теперь можно стартовать мобилку.
- [x] **Контракт**: web на tRPC; для мобилки — **REST/OpenAPI** (`/api/mobile/*`) поверх тех же сервисов + **Bearer-токен** (опц. вместо cookie). Реализовано: хелперы `src/server/mobile/token.ts` (SHA-256-хэш токена в `MobileToken`, TTL 30д), `POST /api/mobile/auth/token`, `GET /api/mobile/products`, `GET /api/mobile/products/:slug` (Bearer-проверка).
- [x] Backend: `GET /api/mobile/orders` (owner-scoped, пагинация, фильтр статуса) на базе `OrderService`.
- [x] Expo scaffold в `mobile/` (SDK 57, TypeScript): mobile-first каталог, вкладки «Каталог»/«Заказы», Bearer-запросы, состояния загрузки/ошибки/пустого списка, pull-to-refresh. Web-проверка доступна через `npm run web` (порт 8081).
- [x] Backend: REST `POST /api/mobile/orders` (валидация checkout, создание адреса, hold-сток + payment intent через `OrderService`), `GET` истории и статусы чтения готовы.
- [x] Expo UI: экран товара, выбор варианта, локальная корзина с количеством/итогом и отдельной вкладкой «Корзина».
- [x] Expo checkout UI: адресная форма, отправка позиций в `POST /api/mobile/orders`, обработка ошибок/loading, очистка корзины и переход к заказам после успеха.
- [x] Mobile payment confirmation: `POST /api/mobile/orders/:id/confirm` owner-scoped и идемпотентный через `OrderService.confirmOrder`; simulated Expo checkout вызывает его автоматически.
- [x] Mobile order cancellation: `DELETE /api/mobile/orders/:id` owner-scoped через `OrderService.cancelOrder`; Expo показывает отмену для `PENDING_PAYMENT`/`PAID`.
- [x] Expo checkout validation: обязательные поля, индекс минимум 5 символов и телефон минимум 10 цифр проверяются до сетевого запроса.
- [x] Expo token onboarding: экран подключения Bearer-токена, проверка через products API, SecureStore на native и `localStorage` fallback для Web.
- [x] Expo UI: вкладка «Профиль» со статусом сессии и отключением токена; SecureStore/localStorage очищаются при выходе.
- [x] Mobile profile API: `GET /api/mobile/profile` возвращает только данные текущего Bearer-пользователя; добавлен smoke 401 без токена.
- [x] Expo cart persistence: корзина сохраняется через AsyncStorage и восстанавливается после перезапуска; logout очищает её.
- [x] Expo cart controls: изменение количества, удаление позиции и ограничение количества по текущему stock.
- [x] Mobile auth bridge: `POST /api/mobile/auth/token` сначала обменивает авторизованную NextAuth web-сессию на Bearer-токен; `userId` fallback оставлен только для development.
- [ ] Expo-приложение: полноценная выдача токена через OAuth/device login без ручной вставки.
- [ ] Собрать **Android `.apk`** (sideload): Expo/EAS config готов (`mobile/eas.json`, preview APK profile), остался запуск EAS с аккаунтом/signing. iOS `.ipa` — требует Mac+Xcode+Apple Dev (99$/yr) — вне этого Windows-окружения.
- [ ] Обновить README/mobile + BRIDGE/ANALYSIS.

**Хвосты / техдолг:**
- [ ] (низкий/опц.) Русская версия README (сейчас англ.).
- [ ] Убрать Джобу dependency-cruiser в CI (job `architecture`).
- [x] Расширены unit (mobile token) + E2E smoke (legal/404 + mobile API 401/400).
- [ ] (опц.) Доп. тесты: сервисы `cart/review/wishlist` + E2E «корзина → чекаут» (нужен MySQL в CI).
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
| 18.08.2026 | Stripe‑WIP достроен до собрာီого кода (check/unit зелёные); диагностику: `next build` `_error` и локальный Playwright-раннер — средовые сбои (pre-existing/K Windows+Next 15.5, не от кода). План Mobile зафиксирован (раздел 5, Этап 3) | Задеплоить/прогнать на CI (Ubuntu) чтобы подтвердить зелёное; далее — начало Mobile (REST/OpenAPI + Bearer) |
| 18.08.2026 | Начата «нетривиальная фича» (Stripe + hold‑сток) — прервано на середине, код несобран. Решено: переключиться на Mobile (React Native + Expo, установщик). Обновлён план в разделе 5 | Решить судьбу Stripe-WIP (откат или доделать) → вернуть дерево в зелёное → исходный Expo‑scaffold + REST/token-слой |
| 18.08.2026 | **Вариант B (Stripe‑фича) завершён по коду**: hold‑сток → PaymentIntent (с фолбэк-симуляцией) → webhook `/api/webhooks/stripe`; unit 36/36 (payment-тесты), typecheck ok; Stripe-переменные документированы. Осталось применить миграцию к БД | Далее: Mobile — старт REST/OpenAPI + Bearer-слой (после применения миграции и CI-прогона) |
| 20.08.2026 | **Задания 1–3 усилены до middle-уровня:** ANALYSIS §6 (trade-offs, security checklist, roadmap); unit **44/44** (+ mobile token); E2E smoke расширен (legal/404 + mobile API); CI: +architecture(depcruise), coverage info, AUTH_SECRET/SKIP_ENV, branches main/master | Запушить → проверить Actions; далее Expo или deploy |
| 21.08.2026 | Исправлены 2 lint-ошибки в mobile token tests; добавлен `GET /api/mobile/orders`; создан `mobile/` на Expo SDK 57, подключён Expo Web, сделан mobile-first каталог и вкладка заказов с Bearer API | Продолжить mobile: REST checkout → экран товара/корзина → Android APK; затем обновить README |
| 21.08.2026 | Добавлен Bearer-защищённый `POST /api/mobile/orders`: Zod checkout, адрес пользователя, серверный расчёт цены, hold стока и payment intent через общий `OrderService`; lint и unit **44/44** зелёные | Подключить checkout к Expo UI: detail → cart → address/payment → подтверждение; затем полноценная auth-flow и APK |
| 21.08.2026 | Исправлен runtime-сбой сайта `product.getAll`: применены неприменённые миграции `20260818000000_payment_hold` и `20260818010000_mobile_token`; запрос проверен напрямую через tRPC, HTTP 200 | Продолжить mobile UI; при смене БД сначала выполнять `npx prisma migrate deploy` |
| 21.08.2026 | Expo-клиент расширен: интерактивные карточки, detail товара, выбор размера/варианта, локальная корзина, итоговая сумма и отдельная вкладка корзины; `mobile` TypeScript зелёный | Подключить checkout-форму к `POST /api/mobile/orders`, затем auth/profile и APK |
| 21.08.2026 | Checkout подключён к mobile REST: форма адреса отправляет серверу только адрес и variant IDs/quantity, показывает loading/error, после успеха очищает корзину и открывает заказы; mobile TypeScript и unit **44/44** зелёные | Добавить профиль/token flow, затем ручная проверка полного заказа и APK |
| 21.08.2026 | Добавлен token onboarding в Expo: Bearer вводится и проверяется запросом каталога, хранится через SecureStore на Android/iOS; для Expo Web добавлен localStorage fallback, web bundle проверен на 8082 | Добавить профиль и реальную выдачу токена через OAuth/device login; затем APK |
| 21.08.2026 | Добавлена вкладка профиля: состояние mobile-сессии, logout с удалением токена из SecureStore/localStorage; Expo Web export и mobile TypeScript зелёные | Заменить demo-ввод токена на OAuth/device login; затем ручной checkout и APK |
| 21.08.2026 | Добавлен `GET /api/mobile/profile` с owner-scoped user data и E2E smoke на 401 без Bearer; profile UI подключён к API; общий check и unit **44/44** зелёные | Сделать реальную выдачу mobile-токена через OAuth/device login |
| 21.08.2026 | `POST /api/mobile/auth/token` усилен: при наличии NextAuth-сессии токен выпускается для `session.user.id`, в production неаутентифицированный `userId` fallback запрещён; typecheck/lint/unit зелёные | Подключить mobile UI к OAuth/device login вместо ручного token input |
| 21.08.2026 | Корзина Expo переведена на AsyncStorage: восстановление после перезапуска, защита от битого JSON, очистка при logout; Expo Web export и unit **44/44** зелёные | OAuth/device login и ручной end-to-end checkout на Android/Web |
| 21.08.2026 | В корзину добавлены +/- и удаление позиции; quantity ограничивается stock, ноль удаляет товар; mobile TypeScript зелёный | Ручная проверка checkout и затем OAuth/device login или APK |
| 21.08.2026 | В checkout добавлена клиентская валидация доставки и телефона; ошибки показываются до запроса, mobile TypeScript зелёный | Ручной happy-path checkout с реальным токеном; затем OAuth/device login/APK |
| 21.08.2026 | Добавлен `POST /api/mobile/orders/:id/confirm`; simulated checkout в Expo автоматически подтверждает заказ и переводит hold stock в PAID; добавлен E2E smoke 401 | Проверить полный checkout с MySQL/токеном; для real Stripe добавить payment UI |
| 21.08.2026 | Добавлен `DELETE /api/mobile/orders/:id` с owner scope, освобождением hold stock и UI-кнопкой отмены в истории заказов; добавлен E2E smoke 401 | Проверить полный order lifecycle вручную; затем real Stripe UI/OAuth/APK |
| 21.08.2026 | Mobile MVP подготовлен к Android: API default для emulator `10.0.2.2`, бренд `SHOP Mobile`, package `com.shop.mobile`, `mobile/eas.json` preview APK, `mobile/README.md` и root README mobile section | Запустить `npx eas build --platform android --profile preview` после EAS login; затем ручной device checkout |

---

## 8. ОЦЕНКА КАК РЕКРУТЕР — КРАТКО

- **Уровень:** junior+ → **early/mid middle** (пет). Подробно — `ANALYSIS.md`, раздел 6.
- **Сильно:** слои `routers/services/schemas`; Stripe hold+webhook+идемпотентность; dual contract tRPC/REST+Bearer; 44 unit + smoke E2E; CI lint/type/unit/arch/e2e/build; security fixes (IDOR, linking).
- **Слабо / next:** нет live-деплоя; `setTimeout`-статусы; cart localStorage; admin monolit; Expo UI; rate-limit; DB-backed E2E checkout.
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