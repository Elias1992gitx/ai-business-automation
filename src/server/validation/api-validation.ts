import { INPUT_LIMITS } from "@/src/lib/constants";

export function validateProcessInput(data: {
  title?: string;
  description?: string;
  desired_outcome?: string;
  constraints?: string;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.title || data.title.trim().length === 0) {
    errors.push("Title is required");
  } else if (data.title.length > INPUT_LIMITS.PROCESS_TITLE) {
    errors.push(`Title must be less than ${INPUT_LIMITS.PROCESS_TITLE} characters`);
  }

  if (!data.description || data.description.trim().length === 0) {
    errors.push("Description is required");
  } else if (data.description.length > INPUT_LIMITS.PROCESS_DESCRIPTION) {
    errors.push(`Description must be less than ${INPUT_LIMITS.PROCESS_DESCRIPTION} characters`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

