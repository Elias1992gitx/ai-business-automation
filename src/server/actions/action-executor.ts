import { actionRegistry } from "./action-registry";
import type { ActionPayload, ActionResult } from "./action-types";

export class ActionExecutor {
  async execute(actionType: string, payload: ActionPayload): Promise<ActionResult> {
    const handler = actionRegistry.getHandler(actionType);
    if (!handler) {
      return {
        success: false,
        error: `Action handler not found for action type: ${actionType}`,
      };
    }
    return handler(payload);
  }
}

export const actionExecutor = new ActionExecutor();

