import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart } from "@/components/ui/custom-chart";
import { Plus, Pencil, ChevronUp, ChevronDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Schema for rank validation
const rankSchema = z.object({
  name: z.string().min(1, "Rank name is required"),
  commission_rate: z.coerce.number().min(0, "Commission rate must be 0 or more").max(100, "Commission rate must be 100 or less"),
  threshold_pv: z.coerce.number().min(0, "Personal volume threshold must be 0 or more"),
  threshold_gv: z.coerce.number().min(0, "Group volume threshold must be 0 or more"),
});

type RankFormValues = z.infer<typeof rankSchema>;

const CompensationManagement = () => {
  const { toast } = useToast();
  const [ranks, setRanks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRank, setEditingRank] = useState<null | any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const form = useForm<RankFormValues>({
    resolver: zodResolver(rankSchema),
    defaultValues: {
      name: "",
      commission_rate: 0,
      threshold_pv: 0,
      threshold_gv: 0
    }
  });

  // Fetch ranks from Supabase
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

  // Reset form when dialog opens/closes or when editing rank changes
  useEffect(() => {
    if (isDialogOpen) {
      if (editingRank) {
        form.reset({
          name: editingRank.name || "",
          commission_rate: editingRank.commission_rate || 0,
          threshold_pv: editingRank.threshold_pv || 0,
          threshold_gv: editingRank.threshold_gv || 0
        });
      } else {
        form.reset({
          name: "",
          commission_rate: 0,
          threshold_pv: 0,
          threshold_gv: 0
        });
      }
    }
  }, [isDialogOpen, editingRank, form]);

  // Handle form submission
  const onSubmit = async (values: RankFormValues) => {
    try {
      if (editingRank) {
        // Update existing rank
        const { error } = await supabase
          .from("ranks")
          .update({
            name: values.name,
            commission_rate: values.commission_rate,
            threshold_pv: values.threshold_pv,
            threshold_gv: values.threshold_gv
          })
          .eq("id", editingRank.id);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Rank updated successfully",
        });
      } else {
        // Create new rank
        const { error } = await supabase
          .from("ranks")
          .insert([{
            name: values.name,
            commission_rate: values.commission_rate,
            threshold_pv: values.threshold_pv,
            threshold_gv: values.threshold_gv
          }]);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Rank created successfully",
        });
      }
      
      // Close dialog and refresh ranks
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

  // Move rank up or down in the hierarchy
  const moveRank = async (rankId: string, direction: 'up' | 'down') => {
    const rankIndex = ranks.findIndex(r => r.id === rankId);
    if (rankIndex === -1) return;
    
    const swapIndex = direction === 'up' ? rankIndex - 1 : rankIndex + 1;
    if (swapIndex < 0 || swapIndex >= ranks.length) return;
    
    try {
      const currentRank = ranks[rankIndex];
      const swapRank = ranks[swapIndex];
      
      // For simplicity, we're just swapping the PV thresholds
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
      
      // Update both ranks
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

  // Open dialog for creating/editing a rank
  const openRankDialog = (rank: any = null) => {
    setEditingRank(rank);
    setIsDialogOpen(true);
  };

  // Prepare chart data
  const chartData = ranks.map(rank => ({
    name: rank.name,
    "Commission Rate": rank.commission_rate,
    "PV Threshold": rank.threshold_pv / 100, // Scale down for better visualization
    "GV Threshold": rank.threshold_gv / 1000, // Scale down for better visualization
  }));

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
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rank Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Bronze, Silver, Gold" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="commission_rate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Commission Rate (%)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" max="100" step="0.5" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="threshold_pv"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Personal Volume Threshold</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="threshold_gv"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Group Volume Threshold</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <DialogFooter className="mt-6">
                    <Button type="submit">Save Rank</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Rank Structure</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-80 flex items-center justify-center">
                  <div className="animate-pulse">Loading ranks data...</div>
                </div>
              ) : (
                <div className="h-80">
                  <BarChart 
                    data={chartData} 
                    index="name"
                    categories={["Commission Rate", "PV Threshold", "GV Threshold"]}
                    colors={["blue", "green", "purple"]}
                    yAxisWidth={30}
                  />
                </div>
              )}
            </CardContent>
          </Card>
          
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
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Commission Rate</TableHead>
                <TableHead>PV Threshold</TableHead>
                <TableHead>GV Threshold</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="animate-pulse">Loading ranks...</div>
                  </TableCell>
                </TableRow>
              ) : ranks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No ranks found. Add one to get started!
                  </TableCell>
                </TableRow>
              ) : (
                ranks.map((rank, index) => (
                  <TableRow key={rank.id}>
                    <TableCell className="font-medium">{rank.name}</TableCell>
                    <TableCell>{rank.commission_rate}%</TableCell>
                    <TableCell>{rank.threshold_pv}</TableCell>
                    <TableCell>{rank.threshold_gv}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => moveRank(rank.id, 'up')}
                          disabled={index === 0}
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => moveRank(rank.id, 'down')}
                          disabled={index === ranks.length - 1}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => openRankDialog(rank)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CompensationManagement;
