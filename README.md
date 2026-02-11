# DL Speaks

Projeto pessoal que eu fiz pra estudar inglês em casa. A ideia é ter um dicionário à mão: buscar palavra, ver definição, transcrição fonética, áudio da pronúncia, exemplos e sinônimos — e ir guardando as que busquei recentemente pra revisar.

## O que tem aqui

- **Login** — entra com email/senha (backend separado).
- **Dashboard** — Home (perfil) e **Dictionary**.
- **Dictionary / Words** — campo de busca com sugestões das palavras recentes. Busco a palavra, a API devolve definições, part of speech, exemplos, áudio (quando tem) e dá pra adicionar aos favoritos.
- **Palavras recentes** — badges clicáveis com as últimas palavras buscadas; clico de novo e já carrega o resultado.

Stack: Next.js 16 (App Router), React 19, TypeScript, Tailwind, Zustand, formulários com react-hook-form + zod, UI com componentes no estilo shadcn.

## Rodar em desenvolvimento

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). O front chama um backend em outra URL; precisa configurar a variável de ambiente:

```env
BACKEND_URL=https://sua-api.com
```

(ou a base URL do seu backend)

## Scripts

| Comando     | Descrição              |
|------------|------------------------|
| `npm run dev`   | Servidor de desenvolvimento |
| `npm run build` | Build de produção           |
| `npm run start` | Roda o build (produção)     |
| `npm run lint`  | ESLint                      |

---

Feito pra uso próprio; se quiser clonar e adaptar, fique à vontade.
