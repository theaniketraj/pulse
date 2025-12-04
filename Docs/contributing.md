# Contributing to Vitals

First off, thanks for taking the time to contribute! 🎉

The following is a set of guidelines for contributing to Vitals. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## Development Setup

1. **Prerequisites**:

   - Node.js 16+
   - VS Code 1.94.0+
   - Prometheus (optional, for local data)

2. **Installation**:

   ```bash
   git clone https://github.com/theaniketraj/vitals.git
   cd vitals
   npm install
   ```

3. **Running Locally**:
   - Run `npm run watch` to start the build in watch mode.
   - Press `F5` in VS Code to launch the Extension Development Host.

For more details, see [development.md](./development.md).

## Reporting Bugs

Bugs are tracked as [GitHub issues](https://github.com/theaniketraj/vitals/issues).

When filing an issue, please include:

- A clear title and description.
- Steps to reproduce the issue.
- Expected vs. actual behavior.
- Screenshots or logs (if applicable).
- Your environment details (OS, VS Code version).

## Suggesting Enhancements

Enhancement suggestions are tracked as [GitHub issues](https://github.com/theaniketraj/vitals/issues).

When suggesting an enhancement, please include:

- A clear title and description.
- Why this enhancement would be useful.
- Examples of how it would work.

## Pull Requests

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. Ensure the test suite passes (`npm test`).
4. Make sure your code follows the existing style (TypeScript, React).
5. Issue that pull request!

## Coding Standards

- **TypeScript**: We use TypeScript for type safety. Avoid `any` where possible.
- **React**: Functional components with Hooks are preferred.
- **Styling**: We use a custom CSS design system (Variables, BEM-like naming).
- **Linting**: Ensure your code is clean and formatted.

## License

By contributing, you agree that your contributions will be licensed under its MIT License.
