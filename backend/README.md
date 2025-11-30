# Backend mínimo Auth - Horta

Este backend Express proporciona:

- Registro de usuarios: `POST /api/auth/register`
- Login con JWT: `POST /api/auth/login`

## Instalación

```bash
npm install
cp .env.example .env   # rellena tus datos de MySQL y JWT
npm run dev
```

Por defecto se levanta en `http://localhost:3001`.
