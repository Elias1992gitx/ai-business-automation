import type { BusinessProcess, CreateProcessInput } from "@/src/types/process.types";

export class ProcessService {
  async getProcesses(_userId: string): Promise<BusinessProcess[]> {
    return [];
  }

  async getProcessById(_id: string): Promise<BusinessProcess | null> {
    return null;
  }

  async createProcess(_userId: string, _input: CreateProcessInput): Promise<BusinessProcess | null> {
    return null;
  }
}

export const processService = new ProcessService();

