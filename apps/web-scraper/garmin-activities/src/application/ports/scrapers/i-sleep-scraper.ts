export type ISleepStages = {
  profundo: number;
  leve: number;
  rem: number;
  acordado: number;
};

export type ISleep = {
  sleepDurationInHours: number;
  sleepStartAt: string;
  wakeUpAt: string;
  stages: ISleepStages;
};
