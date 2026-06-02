import type {MessageCatalog} from "@/app/_lib/i18n/messages/en";

const ptBR: MessageCatalog = {
  orders: {
    title: "Pedidos",
    new: "Novo pedido",
    notFound: "Pedido não encontrado",
    back: "Voltar aos pedidos",
    orderNumber: "Pedido #{id}",
    created: "Criado",
    table: "Mesa",
    staff: "Atendente",
    itemsCount: "Itens",
    total: "Total",
    discounted: "(com desconto)",
    noOrders: "Nenhum pedido encontrado.",
    filterAll: "Todos",
    cardTitle: "Pedido #{id}",
    tableAndDiscount: "Mesa e desconto",
    items: "Itens",
    totals: "Totais",
    closeOrder: "Fechar pedido",
    markPaid: "Marcar como pago",
    delete: "Excluir",
    status: {
      open: "Aberto",
      closed: "Fechado",
      payed: "Pago",
    },
    itemStatus: {
      awaiting: "Aguardando",
      cooking: "Preparando",
      ready: "Pronto",
      with_the_client: "Com o cliente",
      canceled: "Cancelado",
      empty_stock: "Sem estoque",
    },
    itemType: {
      Beer: "Cerveja",
      Drink: "Bebida",
      Dish: "Prato",
      Wine: "Vinho",
    },
    addItem: {
      title: "Adicionar item",
      product: "Produto",
      quantity: "Quantidade",
      loading: "Carregando…",
      select: "Selecione…",
      outOfStock: " (sem estoque)",
      stock: " · estoque: {count}",
      selected: "Selecionado: {name} por {price}{stock}",
      alreadyOnOrder:
        "Este produto já está no pedido (qtd {qty}). Adicionar aumentará a quantidade da linha.",
      notEnoughStock: "Estoque insuficiente. Máximo que você pode adicionar: {max}.",
      submit: "Adicionar ao pedido",
    },
    itemsTable: {
      empty: "Nenhum item ainda. Use o formulário acima para adicionar produtos a este pedido.",
      product: "Produto",
      type: "Tipo",
      kitchen: "Cozinha",
      unit: "Unitário",
      qty: "Qtd",
      lineTotal: "Total linha",
      remove: "Remover item",
    },
    summary: {
      subtotal: "Subtotal",
      discount: "Desconto",
      total: "Total",
    },
    meta: {
      table: "Mesa",
      noTable: "Sem mesa",
      seats: "{count} lugares",
      discount: "Desconto ({currency})",
      autoSave: "Alterações são salvas automaticamente.",
    },
    confirm: {
      removeItem: {
        title: "Remover item",
        message:
          "Remover este item do pedido? O estoque será restaurado para produtos controlados.",
        confirm: "Remover",
      },
      close: {
        title: "Fechar pedido",
        message: "Fechar este pedido? Não será possível adicionar mais itens.",
        confirm: "Fechar pedido",
      },
      markPaid: {
        title: "Marcar como pago",
        message: "Marcar este pedido como pago?",
        confirm: "Marcar pago",
      },
      delete: {
        title: "Excluir pedido",
        message: "Excluir este pedido permanentemente?",
        confirm: "Excluir",
      },
    },
    toast: {
      itemQtyUpdated: "Quantidade do item atualizada",
      itemAdded: "Item adicionado ao pedido",
      itemRemoved: "Item removido",
      orderClosed: "Pedido fechado",
      orderPaid: "Pedido marcado como pago",
      orderDeleted: "Pedido excluído",
    },
  },
};

export default ptBR;
