import type {LegalDocument} from "@/app/_lib/legal/types";

const privacy: LegalDocument = {
  title: "Política de Privacidade",
  lastUpdated: "10 de junho de 2026",
  intro:
    "Esta Política de Privacidade descreve como o uButeco trata dados pessoais de usuários e dados operacionais de estabelecimentos, em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018) e demais normas aplicáveis.",
  sections: [
    {
      title: "1. Controlador e contato",
      paragraphs: [
        "O uButeco atua como controlador dos dados pessoais tratados para cadastro, autenticação, suporte e operação da plataforma.",
        "Para exercer direitos previstos na LGPD ou esclarecer dúvidas sobre privacidade, utilize o canal de contato indicado no site ou na aplicação (seção Contato no rodapé).",
      ],
    },
    {
      title: "2. Dados que coletamos",
      paragraphs: [
        "Dados de cadastro: nome, e-mail, senha (armazenada de forma criptografada), papel de acesso e vínculo com a organização.",
        "Dados do estabelecimento: nome comercial, telefone, logo, configurações regionais (idioma, moeda, fuso horário) e status operacional.",
        "Dados operacionais: pedidos, itens, mesas, movimentações de estoque, registros de atividade necessários ao funcionamento do serviço.",
        "Dados técnicos: logs de acesso, endereço IP, identificadores de sessão, tokens de autenticação e informações de dispositivo/navegador para segurança e diagnóstico.",
      ],
    },
    {
      title: "3. Finalidades e bases legais",
      paragraphs: [
        "Prestar o serviço contratado (execução de contrato ou procedimentos preliminares).",
        "Autenticar usuários, aplicar permissões e isolar dados entre organizações (legítimo interesse e segurança).",
        "Melhorar estabilidade, prevenir fraudes e abusos (legítimo interesse).",
        "Cumprir obrigações legais e responder a solicitações de autoridades quando exigido por lei.",
        "Comunicações transacionais relacionadas à conta (execução de contrato). Marketing direto, quando houver, dependerá de consentimento ou opt-out conforme a lei.",
      ],
    },
    {
      title: "4. Compartilhamento",
      paragraphs: [
        "Não vendemos dados pessoais. Compartilhamento ocorre apenas com provedores de infraestrutura necessários à operação (hospedagem, banco de dados, e-mail transacional, busca/indexação), sob contratos ou cláusulas que exijam proteção adequada.",
        "Dados podem ser divulgados se exigido por lei, ordem judicial ou para proteger direitos, segurança e integridade do serviço e dos usuários.",
      ],
    },
    {
      title: "5. Retenção e eliminação",
      paragraphs: [
        "Mantemos dados enquanto a conta estiver ativa e pelo tempo necessário para cumprir finalidades descritas, obrigações legais, resolução de disputas e backups de segurança.",
        "Após exclusão da conta, dados pessoais serão eliminados ou anonimizados quando não houver base legal para retenção, ressalvadas cópias em backup por prazo limitado.",
      ],
    },
    {
      title: "6. Segurança",
      paragraphs: [
        "Adotamos medidas técnicas e organizacionais proporcionais ao risco: comunicação criptografada (HTTPS), controle de acesso por papéis, isolamento multi-tenant na API, auditorias de dependências e boas práticas de desenvolvimento.",
        "Nenhum sistema é totalmente imune a incidentes. Em caso de violação relevante de dados pessoais, adotaremos medidas de mitigação e comunicação conforme exigido pela LGPD.",
      ],
    },
    {
      title: "7. Seus direitos (LGPD)",
      paragraphs: [
        "Você pode solicitar: confirmação de tratamento, acesso, correção, anonimização, portabilidade, eliminação de dados desnecessários, informação sobre compartilhamento e revogação de consentimento quando aplicável.",
        "Pedidos serão atendidos em prazo razoável, podendo ser necessária verificação de identidade. O encarregado de dados (DPO), se designado, será informado nesta página.",
      ],
    },
    {
      title: "8. Cookies e armazenamento local",
      paragraphs: [
        "Utilizamos armazenamento local do navegador para token de sessão (JWT) e preferências de interface (ex.: tema claro/escuro), necessários ao funcionamento autenticado.",
        "Não utilizamos, nesta versão, cookies de publicidade de terceiros. Ferramentas analíticas, se introduzidas futuramente, serão descritas aqui com opções de consentimento quando exigidas.",
      ],
    },
    {
      title: "9. Transferência internacional",
      paragraphs: [
        "Infraestrutura ou subprocessadores podem estar localizados fora do Brasil. Nesses casos, adotamos salvaguardas compatíveis com a LGPD, como cláusulas contratuais padrão ou países com nível adequado de proteção reconhecido.",
      ],
    },
    {
      title: "10. Menores de idade",
      paragraphs: [
        "O serviço destina-se a estabelecimentos comerciais e seus colaboradores. Não coletamos intencionalmente dados de menores de 18 anos para cadastro autônomo.",
      ],
    },
    {
      title: "11. Alterações desta política",
      paragraphs: [
        "Esta política pode ser atualizada. A data da última revisão será indicada no topo. Alterações relevantes poderão ser comunicadas por e-mail ou aviso na aplicação.",
      ],
    },
  ],
};

export default privacy;
