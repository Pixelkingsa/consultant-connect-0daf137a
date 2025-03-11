
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart } from "@/components/ui/custom-chart";

interface RanksChartProps {
  data: any[];
}

export const RanksChart = ({ data }: RanksChartProps) => {
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Rank Structure</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <BarChart 
            data={data}
            index="name"
            categories={["Commission Rate", "PV Threshold", "GV Threshold"]}
            colors={["blue", "green", "purple"]}
            yAxisWidth={30}
          />
        </div>
      </CardContent>
    </Card>
  );
};
