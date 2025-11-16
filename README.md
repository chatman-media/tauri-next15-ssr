# Timeline Studio AI - Документация проекта

## Обзор проекта

Timeline Studio AI - это десктопное приложение на базе Tauri 2.0 и Next.js 16, использующее современный стек технологий для создания кроссплатформенных приложений.

## Технологический стек

### Frontend
- **Next.js 16.0.3** - React фреймворк с App Router
- **React 19.2.0** - библиотека для построения UI
- **TailwindCSS 4.1.17** - utility-first CSS фреймворк
- **TypeScript 5.9.3** - типизированный JavaScript

### Desktop
- **Tauri 2.9.4** - фреймворк для создания десктопных приложений
- **Rust** - backend язык для Tauri

### Инструменты разработки
- **Bun** - пакетный менеджер и runtime (вместо pnpm)
- **Biome 2.3.5** - единственный линтер и форматтер (ESLint удален)
- **Vitest 4.0.9** - unit/integration тестовый фреймворк
- **Testing Library** - утилиты для тестирования React компонентов
- **Playwright 1.56.1** - E2E тестирование
- **Storybook 10.0.7** - разработка и документирование UI компонентов
- **Lefthook 2.0.4** - git hooks менеджер
- **Lint-staged 16.2.6** - запуск линтеров на staged файлах
- **Semantic-release 25.0.2** - автоматические релизы и версионирование

## Структура проекта

```
timeline-studio-ai/
├── src/                          # Исходный код Next.js приложения
│   ├── app/                      # App Router Next.js
│   │   ├── layout.tsx           # Корневой layout
│   │   ├── page.tsx             # Главная страница
│   │   └── page.test.tsx        # Тесты главной страницы
│   ├── components/              # React компоненты
│   │   └── RoundedButton.tsx   # Компонент кнопки
│   └── styles/                  # Стили
│       └── globals.css          # Глобальные стили Tailwind
├── src-tauri/                   # Rust backend для Tauri
│   ├── src/
│   │   ├── lib.rs              # Основная логика Tauri
│   │   └── main.rs             # Entry point
│   ├── icons/                   # Иконки приложения
│   ├── Cargo.toml              # Rust зависимости
│   └── tauri.conf.json         # Конфигурация Tauri
├── dist/                        # Собранный Next.js (SSG)
├── public/                      # Статические файлы
├── next.config.ts              # Конфигурация Next.js
├── tsconfig.json               # Конфигурация TypeScript
├── biome.json                  # Конфигурация Biome
├── vitest.config.mts           # Конфигурация тестов
└── package.json                # Node.js зависимости
```

## Особенности конфигурации

### Next.js
- **Режим**: Static Site Generation (SSG) с `output: "export"`
- **Директория сборки**: `dist/`
- **Оптимизация изображений**: отключена (`unoptimized: true`)
- **Strict Mode**: включен
- **Turbopack**: используется для dev сервера

### TypeScript
- **Target**: ES2021
- **Module Resolution**: bundler
- **JSX**: react-jsx (React 19 без импорта React)
- **Strict mode**: включен
- **Path aliases**: `@/*` → `./src/*`

### Biome
- **Форматирование**: 2 пробела отступ, двойные кавычки
- **Линтинг**: включены рекомендованные правила + специфичные для Next.js
- **CSS**: поддержка Tailwind directives (`@theme`, `@import "tailwindcss"`)
- **Проверка конфликтов**: автоматическое обнаружение дублирующих Tailwind классов
- **Сортировка импортов**: автоматически через `biome check --write`
  - Группировка: внешние пакеты → React хуки → локальные импорты
  - Объединение импортов из одного модуля
  - Алфавитная сортировка внутри групп
- **Файлы**: JS/TS/TSX/CSS из `src/`, `e2e/`, корневые конфиг файлы
- **Исключения**: `src-tauri/`, `dist/`, `.storybook/`, `node_modules/`

### Tauri
- **Идентификатор**: `com.tauri.timeline-studio-ai.app`
- **Название**: Timeline Studio AI
- **Размер окна**: 800x600 (maximized при старте)
- **Frontend URL (dev)**: http://localhost:3000
- **Frontend dist**: ../dist

## Команды для разработки

### Установка зависимостей
```bash
bun install
```

### Разработка

```bash
# Запуск Next.js dev сервера с Turbopack
bun dev

# Запуск приложения в Tauri окне
bun tauri dev
```

### Сборка

```bash
# Сборка Next.js в статические файлы
bun run build

# Полная сборка Tauri приложения
bun tauri build
```

### Качество кода

```bash
# Проверка линтинга
bun run lint

# Форматирование кода
bun run format

# Автоисправление проблем линтинга
bun run fix

# Проверка типов TypeScript
bun run check:type

# Исправить всё (fix + format + check:type)
bun run fix:all
```

### Тестирование

```bash
# Unit/Integration тесты (Vitest)
bun run test              # Запуск тестов
bun run test:watch        # Watch режим

# E2E тесты (Playwright)
bun run test:e2e          # Запуск E2E тестов
bun run test:e2e:ui       # UI режим с браузером
bun run test:e2e:debug    # Debug режим

# Все тесты
bun run test:all          # Unit + E2E
```

### Storybook

```bash
# Запуск Storybook
bun run storybook         # Dev сервер на http://localhost:6006

# Сборка статической версии
bun run build-storybook
```

## Интеграция Tauri и React

### Вызов Rust функций из React

Пример из `src/app/page.tsx`:

```typescript
import { invoke } from "@tauri-apps/api/core";

// Вызов Rust команды
const result = await invoke<string>("greet");
```

Соответствующая Rust функция в `src-tauri/src/lib.rs`:

```rust
#[tauri::command]
fn greet() -> String {
  let now = SystemTime::now();
  let epoch_ms = now.duration_since(UNIX_EPOCH).unwrap().as_millis();
  format!("Hello world from Rust! Current epoch: {epoch_ms}")
}
```

### Важные замечания

1. **"use client" директива**: необходима для компонентов, использующих Tauri API
2. **window/navigator проверки**: Tauri функции должны вызываться только в браузерном контексте
3. **Static Export**: Next.js работает в режиме SSG, SSR не поддерживается

## Шрифты

Проект использует Google Fonts:
- **Geist Sans** - основной шрифт
- **Geist Mono** - моноширинный шрифт

Загружаются через `next/font/google` с оптимизацией.

## Tailwind CSS

### Конфигурация
- **Версия**: 4.1.17 (новая мажорная версия с кардинальными изменениями!)
- **PostCSS плагин**: `@tailwindcss/postcss` (новый для v4)
- **БЕЗ** `tailwind.config.js` - конфигурация теперь в CSS!

### Ключевые отличия от Tailwind 3

| Tailwind 3 | Tailwind 4 |
|------------|------------|
| `@tailwind base/components/utilities` | `@import "tailwindcss"` |
| `tailwind.config.js` обязателен | `@theme { }` в CSS (config опционален) |
| `require('tailwindcss')` в PostCSS | `@tailwindcss/postcss` |
| Кастомизация только в JS | Кастомизация через CSS переменные |

### Структура globals.css

```css
/* 1. Импорт Tailwind (обязательно первым!) */
@import "tailwindcss";

/* 2. Кастомная тема через @theme (новое в v4) */
@theme {
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

/* 3. CSS переменные для темы */
:root {
  --background: #ffffff;
  --foreground: #171717;
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}

/* 4. Глобальные стили */
body {
  color: var(--foreground);
  background: var(--background);
}
```

### Biome и CSS конфликты

Biome автоматически проверяет конфликтующие Tailwind классы:

```tsx
// ❌ Ошибка: cssConflict
className="rounded-xl rounded-full"  // Оба класса устанавливают border-radius

// ❌ Ошибка: cssConflict
className="p-4 p-6"  // Оба устанавливают padding

// ✅ Правильно
className="rounded-full p-6"
```

Для поддержки `@theme` и других Tailwind директив в `biome.json`:

```json
"css": {
  "parser": {
    "tailwindDirectives": true
  }
}
```

## Тестирование

### Unit/Integration тесты (Vitest)

- **Фреймворк**: Vitest 4.0.9
- **Утилиты**: Testing Library для React
- **Окружение**: jsdom для эмуляции DOM

**Расположение**: `src/**/*.test.tsx`

```bash
bun run test         # Запуск всех unit тестов
bun run test:watch   # Watch режим
```

### E2E тесты (Playwright)

- **Фреймворк**: Playwright 1.56.1
- **Браузер**: Chromium (можно добавить Firefox, WebKit)
- **Конфигурация**: `playwright.config.ts`

**Расположение**: `e2e/**/*.spec.ts`

```bash
bun run test:e2e          # Запуск E2E тестов
bun run test:e2e:ui       # UI режим с визуальным браузером
bun run test:e2e:debug    # Debug режим с пошаговым выполнением
```

**Особенности**:
- Автоматически запускает dev сервер перед тестами
- Поддержка параллельного выполнения тестов
- HTML отчет генерируется автоматически
- В CI используется headless режим

### Все тесты сразу

```bash
bun run test:all    # Unit + E2E тесты
```

## Storybook

Storybook используется для разработки и документирования UI компонентов в изоляции.

### Запуск

```bash
bun run storybook         # Запуск dev сервера на :6006
bun run build-storybook   # Сборка статической версии
```

### Структура Stories

Stories размещаются рядом с компонентами:

```
src/components/
├── Button.tsx
└── Button.stories.tsx
```

### Пример Story

```typescript
import type { Meta, StoryObj } from "@storybook/react";
import { MyComponent } from "./MyComponent";

const meta = {
  title: "Components/MyComponent",
  component: MyComponent,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof MyComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Example",
  },
};
```

### Установленные аддоны

- **@storybook/addon-essentials**: базовые аддоны (docs, controls, actions)
- **@storybook/addon-a11y**: проверка доступности
- **@storybook/addon-interactions**: тестирование взаимодействий
- **@storybook/addon-links**: навигация между stories

## Проверка после обновления до Next.js 16

### Выполненные проверки:

1. **Зависимости**: ✅ Все пакеты установлены корректно
2. **Сборка**: ✅ Успешная сборка с Turbopack
3. **TypeScript**: ✅ Компиляция без ошибок
4. **Линтинг**: ✅ Biome проверка пройдена
5. **Тесты**: ✅ Все тесты проходят

### Исправленные проблемы:

1. Обновлена конфигурация Biome:
   - Убран deprecated `experimentalScannerIgnores`
   - Добавлена поддержка Tailwind directives в CSS
   - Исправлены ignore паттерны

2. Отформатирован `tsconfig.json` согласно правилам Biome

3. Удален ESLint и все связанные зависимости:
   - Удалены пакеты: `eslint`, `@eslint/*`, `eslint-config-next`, `eslint-plugin-react-hooks`, `typescript-eslint`
   - Удален файл `eslint.config.mjs`
   - Biome теперь единственный инструмент для линтинга и форматирования

4. Обновлены скрипты в `package.json`:
   - `lint`: только Biome проверка
   - `format`: форматирование через Biome
   - `fix`: автоисправление через Biome
   - `check:type`: проверка типов TypeScript
   - `fix:all`: комплексная проверка (fix + format + check:type)
   - `test`: запуск тестов через vitest
   - `test:watch`: watch режим для тестов

5. Настроена проверка CSS файлов:
   - Добавлены `*.css` файлы в includes Biome
   - Включена поддержка Tailwind directives
   - Автоматическая проверка CSS конфликтов в Tailwind классах

6. Исправлен компонент RoundedButton:
   - Убраны конфликтующие классы (`rounded-xl` vs `rounded-full`)
   - Удалены дублирующиеся `border` классы
   - Упорядочены классы по логическим группам

7. Добавлен Lefthook для git hooks:
   - pre-commit: lint-staged проверяет только измененные файлы
   - commit-msg: проверка Conventional Commits формата
   - pre-push: запуск тестов перед пушем

8. Настроен Semantic Release:
   - Автоматическое версионирование на основе коммитов
   - Создание GitHub Releases
   - Автоматическая генерация CHANGELOG.md
   - Workflow для автоматических релизов

9. Обновлен tsconfig.json:
   - Добавлены `src-tauri` и `dist` в exclude
   - Предотвращает проверку сгенерированных файлов

10. Добавлен Playwright для E2E тестирования:
    - Конфигурация: `playwright.config.ts`
    - Примеры тестов в `e2e/`
    - GitHub workflow для автоматического запуска
    - Скрипты: `test:e2e`, `test:e2e:ui`, `test:e2e:debug`

11. Добавлен Storybook для разработки UI:
    - Версия 10.0.7 с поддержкой Next.js
    - Настроенные аддоны: essentials, a11y, interactions, links
    - Пример story для RoundedButton
    - Скрипты: `storybook`, `build-storybook`

## Миграция с pnpm на bun

Проект изначально был настроен на pnpm, но теперь использует bun:

### Изменения:
- Использован `bun.lock` вместо `pnpm-lock.yaml`
- Все команды работают через `bun` вместо `pnpm`
- Tauri конфигурация обновлена (команды в `tauri.conf.json` пока указывают pnpm - можно обновить)

### Рекомендуемые обновления для полной миграции:

В `src-tauri/tauri.conf.json` можно изменить:
```json
"beforeDevCommand": "bun dev",
"beforeBuildCommand": "bun build"
```

## Git Hooks (Lefthook)

Проект использует Lefthook для автоматической проверки кода перед коммитами и пушами.

### Настроенные хуки:

#### pre-commit
- Запускает **lint-staged** для проверки только измененных файлов
- Автоматически форматирует и исправляет код через Biome
- Файлы: `*.{ts,tsx,js,jsx,css}`

#### commit-msg
- Проверяет формат commit message согласно **Conventional Commits**
- Обязательный формат: `<type>(<scope>): <description>`
- Типы: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`

#### pre-push
- Запускает все тесты перед пушем
- Гарантирует что код рабочий перед отправкой в remote

### Примеры commit messages:

```bash
# ✅ Правильно
feat: add user authentication
fix(api): resolve CORS issue
docs: update README with installation steps
refactor(components): simplify Button logic

# ❌ Неправильно
Added new feature
fixed bug
Update docs
```

### Установка хуков:

```bash
bun run prepare  # Устанавливает Lefthook hooks
```

## Semantic Release

Проект использует semantic-release для автоматического версионирования и создания релизов.

### Как это работает:

1. Коммиты следуют **Conventional Commits** формату
2. При push в `main` запускается GitHub Action
3. Semantic-release анализирует коммиты и определяет новую версию:
   - `feat:` → minor версия (0.X.0)
   - `fix:`, `perf:`, `docs:`, etc. → patch версия (0.0.X)
   - `BREAKING CHANGE:` → major версия (X.0.0)
4. Автоматически создается:
   - Git tag с новой версией
   - GitHub Release с changelog
   - Обновляется `CHANGELOG.md`
   - Обновляется `package.json` версия

### Запуск вручную:

```bash
bun run release  # Локально (требует GITHUB_TOKEN)
```

## GitHub Actions CI/CD

Проект использует GitHub Actions для автоматической проверки кода:

### Workflows:

1. **Lint Node.js** (`.github/workflows/lint-js.yml`)
   - Запускается на push в main и PR
   - Проверяет код через Biome на всех ОС (Ubuntu, macOS, Windows)
   - Использует Bun для установки зависимостей

2. **Check TypeScript Types** (`.github/workflows/check-types.yml`)
   - Проверяет TypeScript типы через `tsc --noEmit`
   - Запускается на Ubuntu

3. **Run Vitest tests** (`.github/workflows/test-js.yml`)
   - Запускает unit/integration тесты через Vitest
   - Запускается на Ubuntu

4. **E2E Tests (Playwright)** (`.github/workflows/e2e.yml`) **НОВЫЙ!**
   - Запускает E2E тесты через Playwright
   - Использует Chromium browser
   - Сохраняет HTML отчет как артефакт
   - Запускается на Ubuntu

5. **Lint Rust** (`.github/workflows/lint-rs.yml`)
   - Проверяет Rust код через rustfmt и clippy
   - Запускается на всех ОС

6. **Release** (`.github/workflows/release.yml`)
   - Запускается на push в main
   - Выполняет все проверки (lint, types, tests, build)
   - Создает автоматический релиз через semantic-release
   - Обновляет версию и создает CHANGELOG.md

7. **Dependabot Auto-merge** (`.github/workflows/dependabot-automerge.yml`)
   - Автоматически мержит minor/patch обновления зависимостей
   - Требует ручной проверки для major обновлений

## Следующие шаги

### Рекомендации по развитию:

1. **Обновить Tauri конфигурацию** - заменить pnpm на bun в `tauri.conf.json`
2. **Расширить тестовое покрытие** - добавить тесты для компонентов
3. **Документировать API** - добавить JSDoc комментарии к функциям
4. **Добавить E2E тесты** - Playwright или Cypress для интеграционных тестов

## Лицензия

MIT License

## Ресурсы

- [Next.js Documentation](https://nextjs.org/docs)
- [Tauri Documentation](https://v2.tauri.app/)
- [TailwindCSS Documentation](https://tailwindcss.com/)
- [Biome Documentation](https://biomejs.dev/)
- [Bun Documentation](https://bun.sh/docs)
