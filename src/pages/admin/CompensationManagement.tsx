
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RankForm, type RankFormValues } from "@/components/admin/ranks/RankForm";
import { RanksTable } from "@/components/admin/ranks/RanksTable";
import { RanksChart } from "@/components/admin/ranks/RanksChart";
import { RankSummary } from "@/components/admin/ranks/RankSummary";
import { prepareChartData } from "@/utils/rankUtils";

const CompensationManagement = () => {
  const { toast } = useToast();
  const [ranks, setRanks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRank, setEditingRank] = useState<null | any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchRanks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("ranks")
        .select("*")
        .order("threshold_pv", { ascending: true });
      
      if (error) throw error;
      setRanks(data || []);
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
    fetchRanks();
  }, []);

  const onSubmit = async (values: RankFormValues) => {
    try {
      if (editingRank) {
        const { error } = await supabase
          .from("ranks")
          .update(values)
          .eq("id", editingRank.id);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Rank updated successfully",
        });
      } else {
        const { error } = await supabase
          .from("ranks")
          .insert([values]);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Rank created successfully",
        });
      }
      
      setIsDialogOpen(false);
      setEditingRank(null);
      fetchRanks();
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
    const rankIndex = ranks.findIndex(r => r.id === rankId);
    if (rankIndex === -1) return;
    
    const swapIndex = direction === 'up' ? rankIndex - 1 : rankIndex + 1;
    if (swapIndex < 0 || swapIndex >= ranks.length) return;
    
    try {
      const currentRank = ranks[rankIndex];
      const swapRank = ranks[swapIndex];
      
      const updates = [
        {
          id: currentRank.id,
          threshold_pv: swapRank.threshold_pv,
          threshold_gv: swapRank.threshold_gv
        },
        {
          id: swapRank.id,
          threshold_pv: currentRank.threshold_pv,
          threshold_gv: currentRank.threshold_gv
        }
      ];
      
      for (const update of updates) {
        const { error } = await supabase
          .from("ranks")
          .update({ 
            threshold_pv: update.threshold_pv,
            threshold_gv: update.threshold_gv
          })
          .eq("id", update.id);
          
        if (error) throw error;
      }
      
      toast({
        title: "Success",
        description: "Rank order updated successfully",
      });
      
      fetchRanks();
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Compensation Management</h1>
            <p className="text-muted-foreground">Configure ranks and commission structures</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => openRankDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                Add Rank
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {editingRank ? "Edit Rank" : "Add New Rank"}
                </DialogTitle>
                <DialogDescription>
                  Configure the rank details and qualification criteria
                </DialogDescription>
              </DialogHeader>
              <RankForm 
                onSubmit={onSubmit}
                initialValues={editingRank}
              />
            </DialogContent>
          </Dialog>
        </div>

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
            onMoveRank={moveRank}
            onEditRank={openRankDialog}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default CompensationManagement;
