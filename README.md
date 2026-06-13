# Cássio Freitas Carús — Landing Page

Landing page pessoal premium com jornada 3D controlada pelo scroll:
**gabinete → placa-mãe → chip → partículas de dados → galáxia digital.**

## Como rodar localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

Para gerar a versão de produção:

```bash
npm run build
npm start
```

## Stack

| Biblioteca | Uso |
| --- | --- |
| Next.js 16 (App Router) + React 19 + TypeScript | Base do projeto |
| Tailwind CSS v4 | Estilos (tokens em `app/globals.css`) |
| Three.js + React Three Fiber | Cena 3D da jornada de scroll |
| framer-motion | Animações de interface (reveal, acordeão, hero) |
| Lenis | Smooth scroll |
| lucide-react | Ícones SVG minimalistas |

## Onde editar cada coisa

### Textos, serviços, FAQ, projetos
Tudo está centralizado em **`content/site.ts`** — nenhum texto fica solto
dentro dos componentes. Edite ali e o site inteiro atualiza.

### WhatsApp e e-mail
No topo de `content/site.ts`:

```ts
whatsappNumber: "5500000000000", // ← troque pelo seu número (DDI+DDD, só dígitos)
email: "cfcarus@hotmail.com",
```

### Cores e fontes
Os tokens estão em `app/globals.css` no bloco `@theme`:

- `--color-ink` — fundo profundo
- `--color-frost` / `--color-steel` — textos
- `--color-azure` / `--color-volt` — azul elétrico / ciano
- `--color-gilt` / `--color-silver` — dourado discreto / prata

As fontes (Space Grotesk + Inter) são configuradas em `app/layout.tsx`.

### SEO
Title, description e Open Graph ficam em `app/layout.tsx`.
Após o deploy, atualize `site.url` em `content/site.ts`.

### Cena 3D
- `components/three/CameraRig.tsx` — keyframes da câmera (o "roteiro" do filme)
- `components/three/stages/` — cada estágio da jornada (gabinete, placa-mãe, chip, partículas, galáxia)
- `lib/journey.ts` — progresso do scroll compartilhado com a cena

A cena tem **fallback automático**: sem WebGL (ou com
`prefers-reduced-motion`), o fundo vira gradientes elegantes em CSS.
No mobile, as contagens de partículas são reduzidas automaticamente.

## Publicar na Vercel

1. Suba o projeto para um repositório no GitHub.
2. Em [vercel.com/new](https://vercel.com/new), importe o repositório.
3. A Vercel detecta Next.js automaticamente — apenas confirme o deploy.

Ou via CLI:

```bash
npm i -g vercel
vercel          # deploy de preview
vercel --prod   # deploy de produção
```

## O que ainda pode ser melhorado

- **Formulário com backend**: hoje o envio abre o WhatsApp com a mensagem
  preenchida. Dá para integrar um endpoint (Resend, Formspree ou API Route).
- **Imagem Open Graph**: criar uma imagem `opengraph-image.png` em `app/`.
- **Favicon personalizado**: substituir `app/favicon.ico`.
- **Analytics**: adicionar `@vercel/analytics` ou GA4.
- **Modelos 3D mais ricos**: o gabinete/placa-mãe são procedurais; um modelo
  GLTF dedicado deixaria a cena ainda mais realista.
- **Galeria de projetos reais** conforme os trabalhos forem entregues.
