
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/layout/AdminLayout";
import { type RankFormValues } from "@/components/admin/ranks/RankForm";
import { RankHeader } from "@/components/admin/ranks/RankHeader";
import { RankDialog } from "@/components/admin/ranks/RankDialog";
import { RankDashboard } from "@/components/admin/ranks/RankDashboard";
import { prepareChartData } from "@/utils/rankUtils";
import { fetchRanks, saveRank, updateRankOrder } from "@/utils/rankDataService";

const CompensationManagement = () => {
  const { toast } = useToast();
  const [ranks, setRanks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRank, setEditingRank] = useState<null | any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const loadRanks = async () => {
    setLoading(true);
    try {
      const data = await fetchRanks();
      setRanks(data);
    } catch (error) {
      console.error("Error fetching ranks:", error);
      toast({
        title: "Error",
        description: "Failed to load ranks. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRanks();
  }, []);

  const onSubmit = async (values: RankFormValues) => {
    try {
      const result = await saveRank(values, editingRank?.id || null);
      
      toast({
        title: "Success",
        description: `Rank ${result.action} successfully`,
      });
      
      setIsDialogOpen(false);
      setEditingRank(null);
      loadRanks();
    } catch (error) {
      console.error("Error saving rank:", error);
      toast({
        title: "Error",
        description: "Failed to save rank. Please try again.",
        variant: "destructive",
      });
    }
  };

  const moveRank = async (rankId: string, direction: 'up' | 'down') => {
    try {
      await updateRankOrder(ranks, rankId, direction);
      
      toast({
        title: "Success",
        description: "Rank order updated successfully",
      });
      
      loadRanks();
    } catch (error) {
      console.error("Error updating rank order:", error);
      toast({
        title: "Error",
        description: "Failed to update rank order. Please try again.",
        variant: "destructive",
      });
    }
  };

  const openRankDialog = (rank: any = null) => {
    setEditingRank(rank);
    setIsDialogOpen(true);
  };

  const chartData = prepareChartData(ranks);

  return (
    <AdminLayout>
      <div className="space-y-8">
        <RankHeader openRankDialog={openRankDialog} />
        
        <RankDialog 
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          editingRank={editingRank}
          onSubmit={onSubmit}
        />
        
        <RankDashboard 
          ranks={ranks}
          loading={loading}
          chartData={chartData}
          onMoveRank={moveRank}
          onEditRank={openRankDialog}
        />
      </div>
    </AdminLayout>
  );
};

export default CompensationManagement;
