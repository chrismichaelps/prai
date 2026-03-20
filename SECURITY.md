# Security Policy

## Supported Versions

We actively maintain the current `main` branch. Please ensure you are running the latest version before reporting an issue.

| Version | Supported          |
| ------- | ------------------ |
| v1.x    | :white_check_mark: |
| < v1.0  | :x:                |

## Reporting a Vulnerability

We take the security of PR/AI seriously. If you discover a security vulnerability, please do NOT open a public issue. Instead, please report it via the following method:

1.  **Direct Contact**: Email the maintainer at `chrisperezsantiago1@gmail.com` with the subject "SECURITY VULNERABILITY: [Brief Description]".
2.  **Details**: Please include a detailed description of the vulnerability, steps to reproduce, and any potential fix.

### Our Commitment

- We will acknowledge receipt of your report within 48 hours.
- We will provide a regular status update until the vulnerability is resolved.
- Once fixed, we will coordinate a public disclosure if necessary.

## General Security Best Practices

- **Environment Variables**: Never commit `.env` files. Ensure your production keys are managed securely via CI/CD (e.g., Vercel / GitHub Secrets).
- **Effect Boundaries**: Use Effect's built-in error handling and sanitization to prevent injection or runtime leakage.

Thank you for helping keep PR/AI secure!
