// Trello REST API client
// IMPORTANT: Server-side only. Never import in client components.

export interface TrelloCard {
  id: string;
  name: string;
  desc: string;
  url: string;
  idList: string;
  due?: string | null;
}

export interface CreateTrelloCardOptions {
  name: string;
  desc: string;
  idList: string;
  due?: string | null;
}

export class TrelloClient {
  private readonly apiKey: string;
  private readonly token: string;
  private readonly baseUrl = "https://api.trello.com/1";

  constructor() {
    const apiKey = process.env.TRELLO_API_KEY;
    const token = process.env.TRELLO_TOKEN;
    if (!apiKey || !token) {
      throw new Error("TRELLO_API_KEY and TRELLO_TOKEN environment variables are required");
    }
    this.apiKey = apiKey;
    this.token = token;
  }

  async createCard(options: CreateTrelloCardOptions): Promise<TrelloCard> {
    const params = new URLSearchParams({
      key: this.apiKey,
      token: this.token,
      name: options.name,
      desc: options.desc,
      idList: options.idList,
      ...(options.due ? { due: options.due } : {}),
    });

    const response = await fetch(`${this.baseUrl}/cards?${params.toString()}`, {
      method: "POST",
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Trello API error ${response.status}: ${error}`);
    }

    return response.json() as Promise<TrelloCard>;
  }
}

