
// Format sales data for chart
export const getPerformanceData = (salesData: any[]) => {
  // If we have real sales data, use it; otherwise use placeholder
  if (salesData.length > 0) {
    // Group by month and calculate totals
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyData = months.map(month => ({
      month,
      sales: 0,
      referrals: 0
    }));
    
    // Process sales data
    salesData.forEach(sale => {
      const date = new Date(sale.date);
      const monthIndex = date.getMonth();
      monthlyData[monthIndex].sales += Number(sale.amount);
    });
    
    return monthlyData;
  } else {
    // Return placeholder data if no real data
    return [
      { month: "Jan", sales: 250, referrals: 5 },
      { month: "Feb", sales: 420, referrals: 8 },
      { month: "Mar", sales: 380, referrals: 12 },
      { month: "Apr", sales: 530, referrals: 15 },
      { month: "May", sales: 450, referrals: 10 },
      { month: "Jun", sales: 620, referrals: 18 },
    ];
  }
};

// Calculate monthly sales total
export const getMonthlySalesTotal = (salesData: any[]) => {
  const currentMonth = new Date().getMonth();
  const currentMonthSales = salesData.filter(sale => {
    const saleMonth = new Date(sale.date).getMonth();
    return saleMonth === currentMonth;
  });
  
  return currentMonthSales.reduce((total, sale) => total + Number(sale.amount), 0);
};
