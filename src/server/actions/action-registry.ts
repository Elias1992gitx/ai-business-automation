import { ACTION_TYPES } from "@/src/lib/constants";
import type { ActionHandler } from "./action-types";

class ActionRegistry {
  private handlers = new Map<string, ActionHandler>();

  register(actionType: string, handler: ActionHandler) {
    this.handlers.set(actionType, handler);
  }

  getHandler(actionType: string): ActionHandler | undefined {
    return this.handlers.get(actionType);
  }

  isSupported(actionType: string): boolean {
    return Object.values(ACTION_TYPES).includes(actionType as (typeof ACTION_TYPES)[keyof typeof ACTION_TYPES]);
  }
}

export const actionRegistry = new ActionRegistry();
