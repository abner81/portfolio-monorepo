export enum ActivityType {
  'CORRIDA' = 'CORRIDA',
  'CORRIDA EM ESTEIRA' = 'CORRIDA EM ESTEIRA',
  'CICLISMO' = 'CICLISMO',
  'TREINO DE FORÇA' = 'TREINO DE FORÇA',
  'NATAÇÃO EM PISCINA' = 'NATAÇÃO EM PISCINA',
  'CARDIOVASVULAR' = 'CARDIOVASVULAR',
}

export type RunIntervalsStats = {
  duration: string;
  distance: string;
  pace: string;
};

export type IActivity = {
  type: ActivityType;
  id: string;
  name: string;
  url: string;
  metrics: Record<string, string>;
  date: Date;
  runIntervalsStats?: RunIntervalsStats;
};
