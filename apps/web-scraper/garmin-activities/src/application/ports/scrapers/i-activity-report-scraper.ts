export type Distance = {
  total: string;
  average: string;
  max: string;
};
export type Duration = {
  total: string;
  average: string;
  max: string;
};
export type HeartRate = {
  average: string;
  max: string;
};
export type Run = {
  averageCadence: string;
};

export type IActivityReport = {
  date: Date;
  activitiesCount: number;
  distance: Distance;
  duration: Duration;
  calories: number;
  averagePace: string;
  heartRate: HeartRate;
  run: Run;
};
