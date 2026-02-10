export interface StationPrices {
  idestacion: string;
  gasolina95: number | null;
  gasolina98: number | null;
  gasoleo: number | null;
  gasoleoPremium: number | null;
  glp: number | null;
  dif95: number | null;
  dif98: number | null;
  difGasoleo: number | null;
  difGasoleoPremium: number | null;
  difGlp: number | null;
  updatedAt: string;
}

export interface Station {
  idestacion: string;
  displayName: string | null;
  zona: string | null;
  propia: boolean;
  isVisible: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  prices: StationPrices | null;
}

export interface StationsResponse {
  stations: Station[];
  zonas: string[];
}
