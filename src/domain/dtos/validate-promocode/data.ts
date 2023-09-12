export interface ValidatePromoCodeDTO {
  promocode_name: string;
  arguments: {
    age?: number;
    meteo?: { town: string };
  };
}
