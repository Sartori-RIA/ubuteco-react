import type {LegalDocument} from "@/app/_lib/legal/types";

const terms: LegalDocument = {
  title: "Termos de Uso",
  lastUpdated: "10 de junho de 2026",
  intro:
    "Estes Termos de Uso regulam o acesso e a utilização do uButeco, plataforma de gestão para bares e restaurantes operada como software como serviço (SaaS). Ao criar uma conta ou utilizar o serviço, você concorda com estes termos.",
  sections: [
    {
      title: "1. Quem somos e escopo do serviço",
      paragraphs: [
        "O uButeco é um sistema multi-tenant que permite a estabelecimentos gerenciar cardápio, pedidos, fila de cozinha, usuários e configurações operacionais da organização.",
        "O serviço é oferecido na modalidade atualmente disponível (incluindo ambientes de demonstração ou produção), podendo ser alterado, suspenso ou descontinuado mediante aviso razoável quando possível.",
      ],
    },
    {
      title: "2. Elegibilidade e conta",
      paragraphs: [
        "Você deve ter capacidade legal para contratar em nome do estabelecimento que representa. Ao se cadastrar, declara que as informações fornecidas são verdadeiras e que manterá seus dados atualizados.",
        "Credenciais de acesso são pessoais e intransferíveis. Você é responsável por todas as atividades realizadas na conta e deve notificar imediatamente qualquer uso não autorizado.",
      ],
    },
    {
      title: "3. Organizações e papéis de acesso",
      paragraphs: [
        "Cada estabelecimento opera em uma organização isolada. Papéis (administrador, cozinha, garçom, caixa, etc.) definem o que cada usuário pode ver ou alterar dentro da organização.",
        "O administrador da organização é responsável por convites, permissões e pelo uso adequado do sistema por sua equipe.",
      ],
    },
    {
      title: "4. Uso aceitável",
      paragraphs: [
        "É proibido utilizar o uButeco para fins ilícitos, para tentar acessar dados de outras organizações, para interferir na segurança ou disponibilidade do serviço, ou para enviar conteúdo malicioso.",
        "Você mantém a titularidade dos dados operacionais inseridos (pedidos, cardápio, clientes internos). Concede ao uButeco licença limitada para hospedar, processar e exibir esses dados apenas para prestar o serviço.",
      ],
    },
    {
      title: "5. Disponibilidade e suporte",
      paragraphs: [
        "Empregamos esforços razoáveis para manter o serviço disponível, mas não garantimos operação ininterrupta ou livre de erros. Manutenções programadas ou emergenciais podem ocorrer.",
        "Recursos podem ser adicionados, modificados ou removidos conforme evolução do produto. Documentação e APIs publicadas podem ser atualizadas.",
      ],
    },
    {
      title: "6. Planos, preços e pagamento",
      paragraphs: [
        "Quando funcionalidades pagas forem oferecidas, condições comerciais específicas serão apresentadas no momento da contratação. Enquanto o serviço for disponibilizado gratuitamente ou em beta, isso poderá mudar com aviso prévio.",
        "Inadimplência ou violação destes termos pode resultar em suspensão ou encerramento do acesso.",
      ],
    },
    {
      title: "7. Propriedade intelectual",
      paragraphs: [
        "O software, marca, layout e documentação do uButeco permanecem de titularidade de seus autores e licenciantes. Componentes open-source são utilizados conforme suas respectivas licenças.",
        "Feedback ou sugestões enviados podem ser utilizados para melhorar o produto sem obrigação de compensação.",
      ],
    },
    {
      title: "8. Limitação de responsabilidade",
      paragraphs: [
        "Na extensão permitida pela lei aplicável, o uButeco não se responsabiliza por lucros cessantes, perda de dados causada por mau uso ou falhas de terceiros, ou decisões operacionais tomadas com base em informações exibidas no sistema.",
        "O serviço é fornecido \"como está\". Recomendamos backups e procedimentos internos de conferência para operações críticas do estabelecimento.",
      ],
    },
    {
      title: "9. Encerramento",
      paragraphs: [
        "Você pode solicitar encerramento da conta conforme funcionalidades disponíveis na aplicação. Podemos suspender ou encerrar contas que violem estes termos ou representem risco à segurança.",
        "Após encerramento, dados poderão ser retidos pelo período necessário para cumprimento legal ou backup, e depois eliminados conforme a Política de Privacidade.",
      ],
    },
    {
      title: "10. Alterações e lei aplicável",
      paragraphs: [
        "Estes termos podem ser atualizados. A data da última revisão constará no topo desta página. O uso continuado após alterações constitui aceite.",
        "Aplica-se a legislação brasileira. Fica eleito o foro da comarca do domicílio do usuário pessoa jurídica ou, na ausência de domicílio comercial no Brasil, o foro da capital do Estado de São Paulo.",
      ],
    },
  ],
};

export default terms;
