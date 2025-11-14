export type TRefreshInterval = 5 | 10 | 15 | 30 | 60; // seconds

export type TRefreshSettings = {
  enabled: boolean;
  interval: TRefreshInterval;
};

export type TSettings = {
  refresh: TRefreshSettings;
};
