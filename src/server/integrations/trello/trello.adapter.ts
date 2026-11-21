// Trello adapter — maps AI-Business-Automation domain types to Trello API calls

import { TrelloClient, type TrelloCard } from "./trello.client";
import type { CreateTrelloCardParams } from "@/src/types/workflow.types";

export class TrelloAdapter {
  private client: TrelloClient;

  constructor() {
    this.client = new TrelloClient();
  }

  async createTask(params: CreateTrelloCardParams): Promise<{
    externalId: string;
    externalUrl: string;
    card: TrelloCard;
  }> {
    const card = await this.client.createCard({
      name: params.title,
      desc: params.description,
      idList: params.list_id,
      due: params.due_date ?? null,
    });

    return {
      externalId: card.id,
      externalUrl: card.url,
      card,
    };
  }
}

