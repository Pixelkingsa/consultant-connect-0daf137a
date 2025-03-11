
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, Eye } from "lucide-react";
import { format } from "date-fns";

const WithdrawalsManagement = () => {
  const { toast } = useToast();
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState("created_at");
  const [sortDirection, setSortDirection] = useState("desc");
  const [viewingWithdrawal, setViewingWithdrawal] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [totalPendingAmount, setTotalPendingAmount] = useState(0);
  const [totalProcessedAmount, setTotalProcessedAmount] = useState(0);

  // Fetch withdrawals from Supabase
  const fetchWithdrawals = async () => {
    setLoading(true);
    try {
      // First get users for reference
      const { data: usersData, error: usersError } = await supabase
        .from("profiles")
        .select("id, full_name");
      
      if (usersError) throw usersError;
      setUsers(usersData || []);
      
      // Then get withdrawals
      let query = supabase
        .from("transactions")
        .select("*")
        .eq("transaction_type", "withdrawal");
      
      // Apply status filter if not "all"
      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }
      
      // Apply sorting
      query = query.order(sortField, { 
        ascending: sortDirection === "asc" 
      });
      
      const { data, error } = await query;
      
      if (error) throw error;
      setWithdrawals(data || []);
      
      // Calculate totals
      const pending = data?.filter(w => w.status === "pending") || [];
      const processed = data?.filter(w => w.status === "completed") || [];
      
      setTotalPendingAmount(pending.reduce((sum, w) => sum + Number(w.amount), 0));
      setTotalProcessedAmount(processed.reduce((sum, w) => sum + Number(w.amount), 0));
    } catch (error) {
      console.error("Error fetching withdrawals:", error);
      toast({
        title: "Error",
        description: "Failed to load withdrawals. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, [statusFilter, sortField, sortDirection]);

  // Toggle sort direction
  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // View withdrawal details
  const viewWithdrawalDetails = (withdrawal: any) => {
    setViewingWithdrawal(withdrawal);
    setIsDialogOpen(true);
  };

  // Update withdrawal status
  const updateWithdrawalStatus = async (withdrawalId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("transactions")
        .update({ status: newStatus })
        .eq("id", withdrawalId);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: `Withdrawal status updated to ${newStatus}`,
      });
      
      // Close dialog and refresh withdrawals
      setIsDialogOpen(false);
      fetchWithdrawals();
    } catch (error) {
      console.error("Error updating withdrawal status:", error);
      toast({
        title: "Error",
        description: "Failed to update withdrawal status. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Get user name from ID
  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? user.full_name : "Unknown User";
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Withdrawals Management</h1>
          <p className="text-muted-foreground">Process and manage consultant withdrawal requests</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Pending Withdrawals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalPendingAmount.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Awaiting processing</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Processed This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalProcessedAmount.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Successfully completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Total Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{withdrawals.length}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => fetchWithdrawals()}>
            Refresh
          </Button>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Withdrawals</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-4">
            {renderTable()}
          </TabsContent>
          <TabsContent value="pending" className="mt-4">
            {renderTable("pending")}
          </TabsContent>
          <TabsContent value="completed" className="mt-4">
            {renderTable("completed")}
          </TabsContent>
          <TabsContent value="rejected" className="mt-4">
            {renderTable("rejected")}
          </TabsContent>
        </Tabs>
        
        {/* Withdrawal details dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Withdrawal Request Details</DialogTitle>
            </DialogHeader>
            {viewingWithdrawal && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="py-2">
                      <CardTitle className="text-sm font-medium">Request Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <dl className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <dt className="font-medium">Amount:</dt>
                          <dd>${viewingWithdrawal.amount.toFixed(2)}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="font-medium">Date:</dt>
                          <dd>{format(new Date(viewingWithdrawal.created_at), "MMM d, yyyy")}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="font-medium">Status:</dt>
                          <dd>
                            <Badge className={
                              viewingWithdrawal.status === "completed" ? "bg-green-100 text-green-800" :
                              viewingWithdrawal.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                              "bg-red-100 text-red-800"
                            }>
                              {viewingWithdrawal.status.charAt(0).toUpperCase() + viewingWithdrawal.status.slice(1)}
                            </Badge>
                          </dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="font-medium">Payment Method:</dt>
                          <dd>{viewingWithdrawal.payment_method || "Not specified"}</dd>
                        </div>
                        {viewingWithdrawal.reference_number && (
                          <div className="flex justify-between">
                            <dt className="font-medium">Reference #:</dt>
                            <dd>{viewingWithdrawal.reference_number}</dd>
                          </div>
                        )}
                      </dl>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="py-2">
                      <CardTitle className="text-sm font-medium">Consultant Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <dl className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <dt className="font-medium">Name:</dt>
                          <dd>{viewingWithdrawal.user_id ? getUserName(viewingWithdrawal.user_id) : "Unknown"}</dd>
                        </div>
                      </dl>
                    </CardContent>
                  </Card>
                </div>
                
                {viewingWithdrawal.notes && (
                  <Card>
                    <CardHeader className="py-2">
                      <CardTitle className="text-sm font-medium">Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{viewingWithdrawal.notes}</p>
                    </CardContent>
                  </Card>
                )}
                
                {viewingWithdrawal.status === "pending" && (
                  <div className="space-y-2">
                    <div className="font-medium">Update Request Status</div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="default"
                        onClick={() => updateWithdrawalStatus(viewingWithdrawal.id, "completed")}
                      >
                        Approve
                      </Button>
                      <Button 
                        variant="destructive"
                        onClick={() => updateWithdrawalStatus(viewingWithdrawal.id, "rejected")}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                )}
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Close
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );

  // Helper function to render the table with optional filter
  function renderTable(filterStatus?: string) {
    const filteredWithdrawals = filterStatus 
      ? withdrawals.filter(w => w.status === filterStatus)
      : withdrawals;
    
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => toggleSort("created_at")}>
                Date
                <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead>Consultant</TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort("amount")}>
                Amount
                <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead>Method</TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort("status")}>
                Status
                <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="animate-pulse">Loading withdrawals...</div>
                </TableCell>
              </TableRow>
            ) : filteredWithdrawals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No withdrawal requests found
                </TableCell>
              </TableRow>
            ) : (
              filteredWithdrawals.map((withdrawal) => (
                <TableRow key={withdrawal.id}>
                  <TableCell>{format(new Date(withdrawal.created_at), "MMM d, yyyy")}</TableCell>
                  <TableCell>{withdrawal.user_id ? getUserName(withdrawal.user_id) : "Unknown"}</TableCell>
                  <TableCell>${withdrawal.amount.toFixed(2)}</TableCell>
                  <TableCell>{withdrawal.payment_method || "Not specified"}</TableCell>
                  <TableCell>
                    <Badge className={
                      withdrawal.status === "completed" ? "bg-green-100 text-green-800" :
                      withdrawal.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                      "bg-red-100 text-red-800"
                    }>
                      {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => viewWithdrawalDetails(withdrawal)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    );
  }
};

export default WithdrawalsManagement;
