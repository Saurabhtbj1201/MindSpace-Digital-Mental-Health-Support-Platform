# Contributing to MindSpace

Thank you for your interest in contributing to MindSpace.

This project supports student mental health and wellness. Please keep empathy, privacy, and user safety at the center of every contribution.

## Code of Conduct

By participating in this repository, you agree to follow our Code of Conduct in `CODE_OF_CONDUCT.md`.

## Before You Start

1. Search existing issues and pull requests to avoid duplicate work.
2. Open an issue for new features or large refactors before starting implementation.
3. Keep pull requests focused and small when possible.

## Local Development Setup

### Prerequisites

- Node.js 16+
- npm
- Python 3.8+
- Git

### Backend

```bash
cd Backend
npm install
npm run dev
```

### Frontend

Serve files in `Frontend/` using a local static server (for example Live Server in VS Code).

### Optional Tests

```bash
cd Backend
npm test
```

## Branch and Commit Guidelines

- Branch naming:
  - `feature/<short-description>`
  - `fix/<short-description>`
  - `docs/<short-description>`
- Commit messages should be clear and imperative, for example:
  - `fix: handle missing token in auth middleware`
  - `docs: add setup instructions for contributors`

## Pull Request Checklist

Before opening a PR, please confirm:

1. Code builds and runs locally.
2. New behavior is tested where practical.
3. No secrets, keys, or private datasets are committed.
4. Documentation is updated for behavior or API changes.
5. PR description explains:
   - What changed
   - Why it changed
   - How to test it

## Security and Privacy Requirements

- Never commit `.env` values, API keys, or credentials.
- Avoid logging personally identifiable information.
- Use least-privilege access for services and integrations.
- For security concerns, follow `SECURITY.md` instead of opening public issues.

## Areas Where Help Is Welcome

- Frontend accessibility and responsive UI fixes
- API validation and error handling improvements
- Test coverage for backend routes and controllers
- Documentation and onboarding improvements

Thank you for helping make MindSpace safer and more useful for students.