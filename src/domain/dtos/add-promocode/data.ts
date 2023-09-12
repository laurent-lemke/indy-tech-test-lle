export enum RestrictionName {
  DATE = "@date",
  METEO = "@meteo",
  AGE = "@age",
  AND = "@and",
  OR = "@or",
}

export interface DateDTO {
  [RestrictionName.DATE]: {
    after: string;
    before: string;
  };
}

export interface MeteoDTO {
  [RestrictionName.METEO]: {
    is?: string;
    temp?: {
      eq?: number;
      lt?: number;
      gt?: number;
    };
  };
}

export interface AgeDTO {
  [RestrictionName.AGE]: {
    eq?: number;
    lt?: number;
    gt?: number;
  };
}

export interface AndDTO {
  [RestrictionName.AND]: AllRestrictionsDTO[];
}

export interface OrDTO {
  [RestrictionName.OR]: AllRestrictionsDTO[];
}

export type AllRestrictionsDTO = DateDTO | MeteoDTO | AgeDTO | AndDTO | OrDTO;

export interface AddPromoCodeDTO {
  name: string;
  avantage: {
    percent: number;
  };
  restrictions: AllRestrictionsDTO[];
}
