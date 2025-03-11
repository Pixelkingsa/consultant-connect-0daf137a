
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RankSummaryProps {
  ranks: any[];
}

export const RankSummary = ({ ranks }: RankSummaryProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rank Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Total Ranks: {ranks.length}
        </p>
        <div className="text-sm">
          <div className="font-medium mb-2">Progression Path:</div>
          <ol className="list-decimal list-inside space-y-1">
            {ranks.map((rank) => (
              <li key={rank.id}>
                {rank.name} ({rank.commission_rate}% commission)
              </li>
            ))}
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};
