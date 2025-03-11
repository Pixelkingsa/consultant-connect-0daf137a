
import { RanksChart } from "@/components/admin/ranks/RanksChart";
import { RankSummary } from "@/components/admin/ranks/RankSummary";
import { RanksTable } from "@/components/admin/ranks/RanksTable";

interface RankDashboardProps {
  ranks: any[];
  loading: boolean;
  chartData: any[];
  onMoveRank: (rankId: string, direction: 'up' | 'down') => Promise<void>;
  onEditRank: (rank: any) => void;
}

export const RankDashboard = ({ 
  ranks, 
  loading, 
  chartData, 
  onMoveRank, 
  onEditRank 
}: RankDashboardProps) => {
  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-3 gap-6">
        <RanksChart data={chartData} />
        <RankSummary ranks={ranks} />
      </div>

      {loading ? (
        <div className="flex justify-center">
          <div className="animate-pulse">Loading ranks...</div>
        </div>
      ) : (
        <RanksTable 
          ranks={ranks}
          onMoveRank={onMoveRank}
          onEditRank={onEditRank}
        />
      )}
    </div>
  );
};
