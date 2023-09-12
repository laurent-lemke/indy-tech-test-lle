import { AsyncLocalStorage } from "node:async_hooks";

export const asyncLocalStorage = new AsyncLocalStorage<LocalStorageContent>();

export interface LocalStorageContent {
  date?: Date;
  age?: number;
  meteoCity?: string;
}
