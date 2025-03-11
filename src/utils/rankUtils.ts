
export const prepareChartData = (ranks: any[]) => {
  return ranks.map(rank => ({
    name: rank.name,
    "Commission Rate": rank.commission_rate,
    "PV Threshold": rank.threshold_pv / 100, // Scale down for better visualization
    "GV Threshold": rank.threshold_gv / 1000, // Scale down for better visualization
  }));
};
