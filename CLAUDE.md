# Claude AI - Контекст проекта

Этот документ содержит важную информацию для AI ассистентов (Claude, ChatGPT и др.) при работе с проектом.

## Общая информация

**Название проекта:** Timeline Studio AI
**Тип:** Десктопное приложение (Tauri + Next.js)
**Пакетный менеджер:** Bun (НЕ npm, НЕ pnpm, НЕ yarn)

## Технологический стек

### Основные технологии
- **Tauri 2.9.4** - десктопный фреймворк (Rust backend)
- **Next.js 16.0.3** - React фреймворк с App Router
- **React 19.2.0** - UI библиотека
- **TypeScript 5.9.3** - язык разработки
- **TailwindCSS 4.1.17** - стилизация
- **Vitest 4.0.9** - тестирование

### Инструменты качества кода
- **Biome 2.3.5** - ЕДИНСТВЕННЫЙ линтер и форматтер
- **ESLint** - НЕ ИСПОЛЬЗУЕТСЯ (удален из проекта)

## Важные правила при работе с кодом

### Команды

```bash
# Разработка
bun dev              # Next.js dev server
bun tauri dev        # Запуск Tauri приложения

# Сборка
bun build            # Сборка Next.js
bun tauri build      # Сборка Tauri приложения

# Проверки качества
bun run lint         # Проверка Biome (НЕ ESLint!)
bun run format       # Форматирование кода
bun run fix          # Авто-исправление проблем Biome
bun run check:type   # Проверка типов TypeScript
bun run fix:all      # Всё сразу: fix + format + check:type

# Тестирование
bun run test         # Unit тесты (Vitest)
bun run test:watch   # Watch режим
bun run test:e2e     # E2E тесты (Playwright)
bun run test:all     # Все тесты (Unit + E2E)

# Storybook
bun run storybook    # UI компоненты dev сервер :6006

# Knip
bun run knip         # Поиск неиспользуемого кода
bun run knip:production  # Только production зависимости

# Commitizen
bun run commit       # Интерактивное создание коммита
git cz               # Альтернатива

# Tauri
bun tauri            # Tauri CLI команды
```

### Структура кода

#### Frontend (Next.js)
- **App Router** (не Pages Router)
- **Server Components** по умолчанию
- **Client Components** требуют `"use client"` директиву
- **Static Export** - только SSG, без SSR

#### Tauri интеграция
```typescript
// Всегда использовать "use client" для Tauri API
"use client";
import { invoke } from "@tauri-apps/api/core";

const result = await invoke<string>("command_name");
```

#### Стилизация
```typescript
// Tailwind классы напрямую
<div className="flex items-center gap-4">

// CSS переменные из @theme
font-[family-name:var(--font-geist-sans)]
```

### Правила именования

- **Компоненты**: PascalCase (`RoundedButton.tsx`)
- **Хуки**: camelCase с префиксом `use` (`useGreet`)
- **Функции**: camelCase (`greet`)
- **Константы**: UPPER_SNAKE_CASE (`MAX_SIZE`)
- **Файлы тестов**: `*.test.tsx` или `*.test.ts`

### TypeScript правила

```typescript
// ✅ Хорошо
const greet = (): void => { ... }
const data = await invoke<string>("greet");

// ❌ Плохо
const greet = () => { ... }  // без типов возврата
const data = await invoke("greet");  // без generic типа
```

### Biome конфигурация

#### JavaScript/TypeScript
- **Отступы**: 2 пробела (НЕ табы)
- **Кавычки**: двойные `"` (НЕ одинарные)
- **Точка с запятой**: обязательна
- **Trailing comma**: есть
- **Line width**: 80 символов
- **Сортировка импортов**: автоматическая при использовании `--write`

**Порядок импортов:**
```tsx
// 1. Директивы
"use client";

// 2. Внешние пакеты
import { invoke } from "@tauri-apps/api/core";

// 3. React (объединяются автоматически)
import { useCallback, useState } from "react";

// 4. Локальные импорты (@/)
import { MyComponent } from "@/components/MyComponent";
```

#### CSS
- **Кавычки**: двойные `"`
- **Tailwind directives**: поддержка `@theme`, `@import "tailwindcss"`
- **CSS Modules**: включены
- **Проверка конфликтов**: `cssConflict` для дублирующих классов

### Структура файлов

```
src/
├── app/              # Next.js App Router
│   ├── layout.tsx   # Root layout
│   └── page.tsx     # Страницы
├── components/       # React компоненты
└── styles/          # Стили
```

## Частые ошибки и их решения

### 1. "window is not defined"
**Причина:** Использование Tauri API в Server Component
**Решение:** Добавить `"use client"` в начало файла

### 2. Проблемы с линтингом
**Правильно:** `bun run lint` (Biome)
**Неправильно:** `bun run eslint` (ESLint удален)

### 3. Использование pnpm вместо bun
**Причина:** Старая конфигурация упоминает pnpm
**Решение:** Всегда использовать `bun`, не `pnpm`

### 4. SSR в Next.js
**Причина:** Tauri требует Static Export
**Решение:** Все страницы должны быть pre-rendered (SSG)

### 5. CSS конфликты в Tailwind классах
**Ошибка:** `'rounded-xl' applies the same CSS properties as 'rounded-full' (cssConflict)`
**Причина:** Два класса устанавливают одно CSS свойство
**Решение:** Оставить только один класс
```tsx
// ❌ Плохо
className="rounded-xl rounded-full"

// ✅ Хорошо
className="rounded-full"
```

## Архитектурные решения

### Почему Biome вместо ESLint?
- Быстрее (написан на Rust)
- Единый инструмент для lint + format
- Лучше интеграция с современным JS/TS
- Меньше конфигурации

### Почему Bun вместо npm/pnpm?
- Быстрая установка зависимостей
- Встроенный TypeScript runtime
- Совместим с Node.js пакетами
- Лучшая производительность

### Почему Tauri вместо Electron?
- Меньший размер бинарника
- Лучшая производительность
- Безопасность (Rust)
- Нативный WebView

## Конфигурационные файлы

### Важные файлы
- `package.json` - Node.js зависимости и скрипты
- `biome.json` - Biome конфигурация
- `tsconfig.json` - TypeScript настройки
- `next.config.ts` - Next.js конфигурация
- `src-tauri/tauri.conf.json` - Tauri настройки
- `vitest.config.mts` - Тестовая конфигурация

### Не редактировать
- `bun.lock` - lockfile (генерируется автоматически)
- `.next/` - кэш Next.js
- `dist/` - собранные файлы
- `src-tauri/target/` - Rust артефакты сборки

## Rust (Tauri Backend)

### Структура
```rust
// src-tauri/src/lib.rs
#[tauri::command]
fn greet() -> String {
  format!("Hello from Rust!")
}

pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_opener::init())
    .invoke_handler(tauri::generate_handler![greet])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
```

### Добавление новой команды
1. Создать функцию с `#[tauri::command]`
2. Добавить в `generate_handler![]`
3. Использовать в frontend через `invoke()`

## Рабочий процесс

### Git Hooks (Lefthook)

Автоматически запускаются:
- **pre-commit**: lint-staged проверяет только измененные файлы
- **commit-msg**: проверка формата Conventional Commits
- **pre-push**: запуск тестов перед пушем

### Формат коммитов (обязательно!)

**Использовать Commitizen для упрощения:**
```bash
bun run commit  # Интерактивный процесс создания коммита
```

**Или вручную:**
```bash
# ✅ Правильно
feat: add new feature
fix(api): resolve bug
docs: update README

# ❌ Неправильно
Added feature
Fixed bug
```

Типы: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`

### Перед коммитом (автоматически через hooks)
```bash
# Git hooks сделают это за вас:
# - lint-staged проверит измененные файлы
# - commit-msg проверит формат сообщения
# - pre-push запустит тесты
```

### Ручная проверка
```bash
bun run fix:all     # Исправить и проверить всё
bun run test        # Запустить тесты
bun run build       # Проверить сборку
bun run knip        # Найти неиспользуемые зависимости
```

### Добавление зависимости
```bash
bun add <package>           # production
bun add -d <package>        # development
```

### Обновление зависимостей
```bash
bun update                  # обновить все
bun update <package>        # обновить конкретный
```

## Полезные паттерны

### Создание компонента
```typescript
"use client"; // если нужен useState, useEffect, или Tauri

import type { FC } from "react";

interface Props {
  title: string;
  onClick: () => void;
}

export const MyComponent: FC<Props> = ({ title, onClick }) => {
  return (
    <button onClick={onClick} className="px-4 py-2">
      {title}
    </button>
  );
};
```

### Работа с Tauri
```typescript
"use client";

import { invoke } from "@tauri-apps/api/core";
import { useCallback, useState } from "react";

export const useGreet = () => {
  const [result, setResult] = useState<string | null>(null);

  const greet = useCallback(async () => {
    try {
      const message = await invoke<string>("greet");
      setResult(message);
    } catch (err) {
      console.error(err);
    }
  }, []);

  return { result, greet };
};
```

## Приоритеты при разработке

1. **Типобезопасность** - использовать TypeScript полностью
2. **Производительность** - оптимизировать рендеринг и сборку
3. **Качество кода** - следовать Biome правилам
4. **Тестирование** - покрывать критичный код
5. **Документация** - комментировать сложную логику

## Ресурсы

- **Next.js 16**: https://nextjs.org/docs
- **Tauri 2**: https://v2.tauri.app/
- **Biome**: https://biomejs.dev/
- **Bun**: https://bun.sh/docs
- **TailwindCSS 4**: https://tailwindcss.com/
- **Vitest**: https://vitest.dev/

---

**Последнее обновление:** 2025-11-17
**Версия проекта:** 0.2.0
