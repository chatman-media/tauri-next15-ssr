# Contributing Guide

## Начало работы

```bash
# Клонировать репозиторий
git clone <repo-url>
cd timeline-studio-ai

# Установить зависимости
bun install

# Установить git hooks
bun run prepare
```

## Разработка

```bash
# Запуск dev сервера Next.js
bun dev

# Запуск в Tauri окне
bun tauri dev

# Запуск тестов в watch режиме
bun run test:watch
```

## Проверки кода

### Автоматически (через git hooks)

При коммите автоматически:
- Форматируется и проверяется код через Biome (только измененные файлы)
- Проверяется формат commit message
- Перед пушем запускаются тесты

### Вручную

```bash
# Полная проверка
bun run fix:all

# Отдельные команды
bun run lint        # Biome линтинг
bun run format      # Форматирование
bun run fix         # Исправление
bun run check:type  # TypeScript типы
bun run test        # Тесты
```

## Формат коммитов

**ОБЯЗАТЕЛЬНО** использовать Conventional Commits формат:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Типы коммитов

- **feat**: новая функциональность (minor версия)
- **fix**: исправление бага (patch версия)
- **docs**: изменения в документации
- **style**: форматирование, пропущенные точки с запятой и т.д.
- **refactor**: рефакторинг кода
- **perf**: улучшение производительности
- **test**: добавление или изменение тестов
- **build**: изменения в системе сборки
- **ci**: изменения в CI конфигурации
- **chore**: другие изменения (не создают релиз)
- **revert**: откат предыдущего коммита

### Примеры

```bash
# Новая функциональность
git commit -m "feat: add user authentication"
git commit -m "feat(api): add REST endpoints for user management"

# Исправление бага
git commit -m "fix: resolve CORS issue in API"
git commit -m "fix(ui): correct button alignment on mobile"

# Документация
git commit -m "docs: update installation instructions"

# Рефакторинг
git commit -m "refactor(components): simplify Button component logic"

# Breaking change (major версия)
git commit -m "feat!: redesign API endpoints

BREAKING CHANGE: API endpoints now use /v2/ prefix"
```

## Workflow

1. **Создать ветку** от `main`
   ```bash
   git checkout -b feat/my-feature
   ```

2. **Разработка**
   - Делать атомарные коммиты
   - Следовать Conventional Commits
   - Git hooks проверят код автоматически

3. **Тестирование**
   ```bash
   # Unit тесты
   bun run test

   # E2E тесты (опционально локально)
   bun run test:e2e

   # Разработка компонентов
   bun run storybook
   ```

4. **Перед пушем**
   ```bash
   bun run fix:all
   bun run test
   # E2E тесты запустятся автоматически в CI
   ```

5. **Создать Pull Request**
   - GitHub Actions запустит все проверки:
     - Lint (Biome)
     - Type check (TypeScript)
     - Unit tests (Vitest)
     - E2E tests (Playwright)
     - Rust lint (rustfmt + clippy)
   - CodeRabbit автоматически проведет AI code review
   - Можешь использовать команды CodeRabbit:
     ```bash
     @coderabbitai review          # Запросить ревью
     @coderabbitai explain         # Объяснить изменения
     @coderabbitai generate tests  # Сгенерировать тесты
     ```
   - Semantic-release создаст релиз автоматически при мерже в main

### CodeRabbit Review

После создания PR, CodeRabbit автоматически:
1. Проанализирует все изменения
2. Оставит комментарии с рекомендациями
3. Создаст high-level summary
4. Проверит специфичные аспекты для разных типов файлов:
   - TypeScript/React: типы, hooks, performance
   - Rust: безопасность, обработка ошибок
   - Тесты: покрытие, best practices
   - CI/CD: корректность pipeline

Если не нужен ревью, добавь в title PR: `WIP`, `DO NOT REVIEW` или `DRAFT`

## Semantic Release

При мерже в `main`:
1. Semantic-release анализирует коммиты
2. Определяет новую версию:
   - `feat:` → minor (0.X.0)
   - `fix:`, `perf:`, `docs:` → patch (0.0.X)
   - `BREAKING CHANGE:` → major (X.0.0)
3. Создает GitHub Release
4. Обновляет CHANGELOG.md
5. Обновляет package.json версию

## Git Hooks

### pre-commit
- Запускает `lint-staged`
- Проверяет только staged файлы
- Автоматически исправляет код

### commit-msg
- Проверяет формат Conventional Commits
- Блокирует коммит если формат неверный

### pre-push
- Запускает все тесты
- Блокирует push если тесты не проходят

### Обход хуков (не рекомендуется)

```bash
git commit --no-verify -m "feat: quick fix"
git push --no-verify
```

## Структура кода

### TypeScript/React
- Использовать строгие типы
- Не использовать `any`
- Следовать Biome правилам
- Использовать `"use client"` для client компонентов

### Стили
- Использовать Tailwind CSS
- Избегать конфликтующих классов
- Следовать mobile-first подходу

### Тесты
- Покрывать критичную логику
- Использовать Testing Library
- Избегать тестирования деталей реализации

## Troubleshooting

### Hooks не работают
```bash
bun run prepare
```

### Ошибка формата коммита
```bash
# Проверить формат
echo "feat: my change" | grep -E "^(feat|fix|docs|...):"

# Изменить последний коммит
git commit --amend
```

### Тесты не проходят
```bash
# Unit тесты в watch режиме
bun run test:watch

# Проверить один unit тест
bunx vitest src/app/page.test.tsx

# E2E тесты с UI
bun run test:e2e:ui

# Debug E2E тест
bun run test:e2e:debug
```

### Разработка UI компонента
```bash
# Запустить Storybook
bun run storybook

# Создать story рядом с компонентом
# src/components/MyComponent.tsx
# src/components/MyComponent.stories.tsx
```

## Полезные ссылки

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Release](https://semantic-release.gitbook.io/)
- [Lefthook](https://github.com/evilmartians/lefthook)
- [Biome](https://biomejs.dev/)
