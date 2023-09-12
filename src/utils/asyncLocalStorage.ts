import { AsyncLocalStorage } from "node:async_hooks";

export const asyncLocalStorage = new AsyncLocalStorage<LocalStorageContent>();

export interface LocalStorageContent {
  date?: Date; // for the sake of simplicity we put it optional - but in a real codebase, it will be mandatory
  age?: number;
  meteoTemperature?: number;
  meteoCondition?: string;
}
