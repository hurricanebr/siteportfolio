/**
 * ============================================================
 * CONTEÚDO DO SITE — edite textos, links e contatos aqui.
 * Nenhum texto fica "escondido" dentro dos componentes.
 * ============================================================
 */

export const site = {
  name: "Cássio Freitas Carús",
  shortName: "Cássio Carús",
  initials: "CFC",
  role: "Tecnologia, Inteligência Artificial e soluções digitais",
  title: "Cássio Freitas Carús | Tecnologia, IA e Soluções Digitais",
  description:
    "Profissional de TI com 14 anos de experiência. Criação de sites, apps, automações com IA, consultoria em tecnologia e soluções digitais para empresas e profissionais.",

  // ── Contatos ───────────────────────────────────────────────
  // Troque pelo seu número com DDI + DDD, apenas dígitos.
  // Exemplo: "5551999999999"
  whatsappNumber: "5500000000000",
  email: "cfcarus@hotmail.com",

  // URL pública do site (usada no Open Graph). Atualize após o deploy.
  url: "https://cassiocarus.vercel.app",
} as const;

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${site.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

// ── Navegação ────────────────────────────────────────────────
export const navLinks = [
  { label: "Experiência", href: "#experiencia" },
  { label: "Serviços", href: "#servicos" },
  { label: "Método", href: "#metodo" },
  { label: "Projetos", href: "#projetos" },
  { label: "FAQ", href: "#faq" },
  { label: "Contato", href: "#contato" },
] as const;

// ── 1. Hero ──────────────────────────────────────────────────
export const hero = {
  eyebrow: "Profissional de TI · 14 anos de experiência",
  headline: "Cássio Freitas Carús",
  subtitle:
    "Tecnologia, Inteligência Artificial e soluções digitais com 14 anos de experiência em TI.",
  support:
    "Crio sites, apps, automações e soluções digitais para empresas e profissionais que precisam transformar tecnologia em resultado.",
  ctaPrimary: { label: "Falar comigo", href: "#contato" },
  ctaSecondary: { label: "Ver serviços", href: "#servicos" },
  ctaTertiary: { label: "Conhecer minha experiência", href: "#experiencia" },
  scrollHint: "Role para entrar na máquina",
} as const;

// ── 2. Experiência ───────────────────────────────────────────
export const experience = {
  eyebrow: "Dentro do hardware",
  title: "14 anos resolvendo problemas com tecnologia.",
  subtitle:
    "Atuo com suporte, infraestrutura, sistemas, análise, desenvolvimento, automação e soluções digitais. Minha base técnica me permite entender problemas reais e transformar ideias em entregas funcionais.",
  highlights: [
    "14 anos de experiência em TI",
    "Visão técnica e prática",
    "Capacidade de entender operação e negócio",
    "Soluções digitais sob medida",
    "Disponível para projetos e oportunidades",
  ],
} as const;

// ── 3. Áreas de atuação (placa-mãe / circuitos) ─────────────
export const circuit = {
  eyebrow: "Trilhas de atuação",
  title: "Conecto tecnologia, estratégia e execução.",
  areas: [
    { icon: "globe", label: "Sites institucionais" },
    { icon: "pointer", label: "Landing pages" },
    { icon: "app", label: "Aplicações web" },
    { icon: "bot", label: "Automações com IA" },
    { icon: "message", label: "Integrações com WhatsApp" },
    { icon: "compass", label: "Consultoria em TI" },
    { icon: "workflow", label: "Otimização de processos" },
    { icon: "store", label: "Soluções para negócios locais" },
    { icon: "boxes", label: "Sistemas internos" },
    { icon: "lifebuoy", label: "Suporte técnico estratégico" },
  ],
} as const;

// ── 4. IA aplicada (chip / processador) ─────────────────────
export const aiSection = {
  eyebrow: "Núcleo de processamento",
  title: "Inteligência Artificial aplicada ao trabalho real.",
  subtitle:
    "Uso IA para acelerar criação, automatizar tarefas, melhorar atendimento, gerar conteúdo, estruturar processos e desenvolver soluções digitais mais rápidas e eficientes.",
  examples: [
    { icon: "messages", label: "Automação de atendimento" },
    { icon: "pen", label: "Geração de conteúdo" },
    { icon: "sparkles", label: "Criação de sites com IA" },
    { icon: "zap", label: "Apps e protótipos rápidos" },
    { icon: "list", label: "Organização de processos" },
    { icon: "plug", label: "Integrações com ferramentas digitais" },
    { icon: "bot", label: "Assistentes personalizados" },
    { icon: "gauge", label: "Otimização de fluxos de trabalho" },
  ],
} as const;

// ── 5. Microcosmo (detalhe técnico) ─────────────────────────
export const micro = {
  eyebrow: "Escala microscópica",
  title: "Detalhe técnico faz diferença.",
  subtitle:
    "Um projeto digital bonito precisa ser rápido, responsivo, bem estruturado, fácil de usar e preparado para gerar contato, venda ou eficiência.",
  highlights: [
    "Performance",
    "Responsividade",
    "Clareza visual",
    "SEO básico",
    "Conversão",
    "Organização de código",
    "Experiência do usuário",
    "Integração com ferramentas",
  ],
} as const;

// ── 6. Galáxia digital (escala e visão) ─────────────────────
export const galaxy = {
  eyebrow: "Escala digital",
  title: "Da estrutura técnica à visão completa.",
  subtitle:
    "Meu trabalho combina experiência em TI, criação digital e Inteligência Artificial para entregar soluções que funcionam no detalhe e fazem sentido no todo.",
  phrases: [
    "Tecnologia bem aplicada simplifica o trabalho.",
    "Um bom site precisa ser bonito, rápido e estratégico.",
    "IA não substitui direção técnica. Ela amplia capacidade de entrega.",
    "Cada solução deve resolver um problema real.",
  ],
} as const;

// ── 7. Serviços ──────────────────────────────────────────────
export const services = {
  eyebrow: "Serviços",
  title: "O que eu posso construir para você.",
  subtitle:
    "Soluções digitais sob medida para empresas, profissionais liberais e negócios locais.",
  items: [
    {
      icon: "globe",
      title: "Sites profissionais",
      description: "Sites institucionais modernos, rápidos e responsivos.",
    },
    {
      icon: "pointer",
      title: "Landing pages",
      description:
        "Páginas focadas em conversão, contato e apresentação de serviços.",
    },
    {
      icon: "app",
      title: "Apps e sistemas web",
      description: "Aplicações sob medida para necessidades específicas.",
    },
    {
      icon: "bot",
      title: "Automações com IA",
      description:
        "Fluxos inteligentes para economizar tempo e reduzir trabalho manual.",
    },
    {
      icon: "compass",
      title: "Consultoria em tecnologia",
      description: "Diagnóstico, orientação e melhoria de processos digitais.",
    },
    {
      icon: "plug",
      title: "Integrações",
      description:
        "WhatsApp, formulários, APIs, CRMs, planilhas e ferramentas online.",
    },
    {
      icon: "fingerprint",
      title: "Identidade digital",
      description: "Organização da presença online com visual profissional.",
    },
    {
      icon: "lifebuoy",
      title: "Suporte e evolução",
      description:
        "Ajustes, melhorias e acompanhamento técnico de projetos.",
    },
  ],
} as const;

// ── 8. Método de trabalho ────────────────────────────────────
export const method = {
  eyebrow: "Método",
  title: "Cada projeto começa pelo problema. Depois vem a tecnologia.",
  subtitle:
    "Antes de escolher ferramentas, entendo o objetivo, o público, o fluxo de trabalho e o resultado esperado.",
  steps: [
    { title: "Diagnóstico", description: "Levantamento do cenário atual e do que precisa mudar." },
    { title: "Entendimento do objetivo", description: "O que o projeto precisa gerar: contato, venda ou eficiência." },
    { title: "Planejamento da solução", description: "Escopo claro, prioridades definidas e caminho de entrega." },
    { title: "Arquitetura técnica", description: "Escolha de ferramentas e estrutura adequadas ao problema." },
    { title: "Design da experiência", description: "Interface clara, navegação simples e foco no usuário." },
    { title: "Desenvolvimento", description: "Construção com código organizado e boas práticas." },
    { title: "Testes", description: "Validação de funcionamento, responsividade e performance." },
    { title: "Publicação", description: "Deploy, configuração de domínio e checagem final." },
    { title: "Melhorias contínuas", description: "Acompanhamento, ajustes e evolução conforme o uso real." },
  ],
} as const;

// ── 9. Projetos / Possibilidades ─────────────────────────────
export const projects = {
  eyebrow: "Possibilidades",
  title: "Exemplos do que podemos construir juntos.",
  subtitle:
    "Tipos de projeto que posso desenvolver — com escopo, prazo e formato ajustados à sua necessidade.",
  items: [
    {
      type: "Site para farmácia",
      problem: "Clientes não encontram informações de horário, serviços e contato.",
      solution: "Site institucional com catálogo de serviços e contato direto.",
      benefit: "Criado para organizar informações e melhorar atendimento.",
    },
    {
      type: "Site para salão de beleza",
      problem: "Presença online limitada a redes sociais.",
      solution: "Site com apresentação de serviços, fotos e agendamento via WhatsApp.",
      benefit: "Projetado para melhorar apresentação profissional.",
    },
    {
      type: "Landing page para profissional liberal",
      problem: "Falta de uma página única que apresente o serviço e gere contato.",
      solution: "Landing page com proposta clara, prova de credibilidade e CTA.",
      benefit: "Pensado para facilitar contato pelo WhatsApp.",
    },
    {
      type: "Sistema interno simples",
      problem: "Controles feitos em papel ou planilhas desorganizadas.",
      solution: "Sistema web simples para cadastro, consulta e organização.",
      benefit: "Estruturado para reduzir tarefas manuais.",
    },
    {
      type: "Automação de atendimento",
      problem: "Mensagens repetitivas consomem tempo da equipe.",
      solution: "Fluxo automatizado com respostas inteligentes e triagem.",
      benefit: "Estruturado para reduzir tarefas manuais.",
    },
    {
      type: "Página de captura",
      problem: "Campanhas sem destino claro para converter interessados.",
      solution: "Página objetiva com formulário e integração com WhatsApp.",
      benefit: "Pensado para facilitar contato pelo WhatsApp.",
    },
    {
      type: "Catálogo digital",
      problem: "Produtos e preços enviados manualmente, um a um.",
      solution: "Catálogo online organizado, fácil de atualizar e compartilhar.",
      benefit: "Criado para organizar informações e melhorar atendimento.",
    },
    {
      type: "Assistente com IA",
      problem: "Dúvidas frequentes sem resposta rápida e padronizada.",
      solution: "Assistente treinado com as informações do negócio.",
      benefit: "Projetado para melhorar atendimento e disponibilidade.",
    },
    {
      type: "Integração com WhatsApp",
      problem: "Site e atendimento desconectados.",
      solution: "Botões, formulários e chamadas diretas para o WhatsApp.",
      benefit: "Pensado para facilitar contato pelo WhatsApp.",
    },
    {
      type: "Dashboard básico",
      problem: "Informações importantes espalhadas em vários lugares.",
      solution: "Painel simples com os números que importam para a operação.",
      benefit: "Criado para organizar informações e apoiar decisões.",
    },
  ],
} as const;

// ── 10. Diferenciais ─────────────────────────────────────────
export const differentials = {
  eyebrow: "Diferenciais",
  title: "Por que trabalhar comigo.",
  items: [
    "14 anos de experiência em TI",
    "Visão técnica e prática",
    "Conhecimento de operação real",
    "Facilidade para entender problemas",
    "Uso inteligente de IA",
    "Foco em solução, não apenas aparência",
    "Comunicação direta",
    "Entrega voltada para uso real",
    "Disponibilidade para projetos variados",
  ],
  statements: [
    "Não entrego apenas uma tela bonita. Entrego uma solução digital pensada para funcionar.",
    "Minha experiência em TI ajuda a transformar ideias em sistemas, páginas e automações úteis.",
    "Uso IA como ferramenta para acelerar, criar e resolver, mas sempre com direção técnica.",
  ],
} as const;

// ── 11. FAQ ──────────────────────────────────────────────────
export const faq = {
  eyebrow: "FAQ",
  title: "Perguntas frequentes.",
  items: [
    {
      question: "Você cria sites do zero?",
      answer:
        "Sim. Posso criar sites institucionais, landing pages, páginas comerciais e experiências digitais personalizadas.",
    },
    {
      question: "Você trabalha com Inteligência Artificial?",
      answer:
        "Sim. Estou focado principalmente em soluções que utilizem IA para criação, automação, produtividade, atendimento e desenvolvimento digital.",
    },
    {
      question: "Você faz apenas o design ou também desenvolve?",
      answer:
        "Posso atuar no planejamento, design, desenvolvimento, publicação e evolução do projeto.",
    },
    {
      question: "Você atende empresas pequenas e profissionais autônomos?",
      answer:
        "Sim. Posso criar soluções para negócios locais, profissionais liberais, empresas pequenas e projetos específicos.",
    },
    {
      question: "O site fica pronto para celular?",
      answer:
        "Sim. O projeto deve ser responsivo, funcionando bem em desktop, tablet e celular.",
    },
    {
      question: "Você pode integrar WhatsApp?",
      answer:
        "Sim. O site pode ter botões, formulários e chamadas diretas para WhatsApp.",
    },
    {
      question: "Você está disponível para emprego fixo?",
      answer:
        "Sim. Além de projetos autônomos, também estou aberto a oportunidades profissionais compatíveis com minha experiência em TI e foco atual em IA.",
    },
    {
      question: "Você faz manutenção depois?",
      answer:
        "Sim. Posso combinar ajustes, melhorias, evolução e suporte conforme a necessidade do projeto.",
    },
  ],
} as const;

// ── 12. Contato ──────────────────────────────────────────────
export const contact = {
  eyebrow: "Contato",
  title: "Vamos criar uma solução digital para o seu próximo passo?",
  subtitle:
    "Estou disponível para projetos, consultorias, sites, apps, automações com IA e oportunidades profissionais em tecnologia.",
  projectTypes: [
    "Site institucional",
    "Landing page",
    "App / sistema web",
    "Automação com IA",
    "Integração (WhatsApp, APIs)",
    "Consultoria em tecnologia",
    "Oportunidade profissional",
    "Outro",
  ],
  submitLabel: "Enviar mensagem",
  whatsappLabel: "Chamar no WhatsApp",
  emailNote: "Prefere e-mail?",
} as const;

export const footer = {
  tagline: "Tecnologia, IA e soluções digitais com visão prática.",
  rights: `© ${new Date().getFullYear()} Cássio Freitas Carús. Todos os direitos reservados.`,
} as const;
