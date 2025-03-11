import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
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
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Eye, Search, ArrowUpDown } from "lucide-react";
import { format } from "date-fns";

const CustomersManagement = () => {
  const { toast } = useToast();
  const [customers, setCustomers] = useState<any[]>([]);
  const [ranks, setRanks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [rankFilter, setRankFilter] = useState("all");
  const [sortField, setSortField] = useState("created_at");
  const [sortDirection, setSortDirection] = useState("desc");
  const [viewingCustomer, setViewingCustomer] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("details");

  // Fetch customers from Supabase
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      // First get ranks for reference
      const { data: ranksData, error: ranksError } = await supabase
        .from("ranks")
        .select("*");
      
      if (ranksError) throw ranksError;
      setRanks(ranksData || []);
      
      // Then get customers with rank information
      let query = supabase
        .from("profiles")
        .select(`
          *,
          rank_info:ranks(*)
        `);
      
      // Apply rank filter if not "all"
      if (rankFilter !== "all") {
        query = query.eq("rank_id", rankFilter);
      }
      
      // Apply search query if present
      if (searchQuery) {
        query = query.ilike("full_name", `%${searchQuery}%`);
      }
      
      // Apply sorting
      query = query.order(sortField, { 
        ascending: sortDirection === "asc" 
      });
      
      const { data, error } = await query;
      
      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast({
        title: "Error",
        description: "Failed to load customers. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [rankFilter, sortField, sortDirection]);

  // Toggle sort direction
  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Handle search
  const handleSearch = () => {
    fetchCustomers();
  };

  // View customer details
  const viewCustomerDetails = (customer: any) => {
    setViewingCustomer(customer);
    setIsDialogOpen(true);
    setSelectedTab("details");
  };

  // Update customer rank
  const updateCustomerRank = async (customerId: string, newRankId: string) => {
    try {
      // Get the rank name from the ID
      const rank = ranks.find(r => r.id === newRankId);
      if (!rank) throw new Error("Rank not found");
      
      const { error } = await supabase
        .from("profiles")
        .update({ 
          rank_id: newRankId,
          rank: rank.name
        })
        .eq("id", customerId);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: `Customer rank updated to ${rank.name}`,
      });
      
      // Close dialog and refresh customers
      setIsDialogOpen(false);
      fetchCustomers();
    } catch (error) {
      console.error("Error updating customer rank:", error);
      toast({
        title: "Error",
        description: "Failed to update customer rank. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Customers Management</h1>
        <p className="text-muted-foreground">Manage your customers and consultants</p>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="flex">
            <Input
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[250px]"
            />
            <Button 
              variant="outline" 
              className="ml-2"
              onClick={handleSearch}
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
          
          <Select
            value={rankFilter}
            onValueChange={setRankFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by rank" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ranks</SelectItem>
              {ranks.map((rank) => (
                <SelectItem key={rank.id} value={rank.id}>
                  {rank.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => fetchCustomers()}>
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <div className="animate-pulse">Loading customers...</div>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer" onClick={() => toggleSort("full_name")}>
                  Name
                  <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead>Rank</TableHead>
                <TableHead className="cursor-pointer" onClick={() => toggleSort("personal_volume")}>
                  Personal Volume
                  <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => toggleSort("group_volume")}>
                  Group Volume
                  <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => toggleSort("team_size")}>
                  Team Size
                  <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No customers found
                  </TableCell>
                </TableRow>
              ) : (
                customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.full_name || "Unnamed User"}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-slate-100">
                        {customer.rank}
                      </Badge>
                    </TableCell>
                    <TableCell>{customer.personal_volume}</TableCell>
                    <TableCell>{customer.group_volume}</TableCell>
                    <TableCell>{customer.team_size}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => viewCustomerDetails(customer)}
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
      )}
      
      {/* Customer details dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
          </DialogHeader>
          {viewingCustomer && (
            <div className="space-y-6">
              <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="details">Profile Details</TabsTrigger>
                  <TabsTrigger value="orders">Order History</TabsTrigger>
                  <TabsTrigger value="team">Team Members</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <h3 className="font-semibold">Profile Information</h3>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="font-medium">Name:</div>
                            <div>{viewingCustomer.full_name || "Not set"}</div>
                            
                            <div className="font-medium">Email:</div>
                            <div>{viewingCustomer.email || "Not available"}</div>
                            
                            <div className="font-medium">Phone:</div>
                            <div>{viewingCustomer.phone || "Not set"}</div>
                            
                            <div className="font-medium">Joined:</div>
                            <div>{format(new Date(viewingCustomer.created_at), "MMM d, yyyy")}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <h3 className="font-semibold">Address Information</h3>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="font-medium">Address:</div>
                            <div>{viewingCustomer.address || "Not set"}</div>
                            
                            <div className="font-medium">City:</div>
                            <div>{viewingCustomer.city || "Not set"}</div>
                            
                            <div className="font-medium">State:</div>
                            <div>{viewingCustomer.state || "Not set"}</div>
                            
                            <div className="font-medium">Zip:</div>
                            <div>{viewingCustomer.zip || "Not set"}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <h3 className="font-semibold">Rank & Performance</h3>
                        <div className="grid grid-cols-4 gap-6 text-sm">
                          <div>
                            <div className="font-medium mb-1">Current Rank</div>
                            <div className="text-lg font-semibold">{viewingCustomer.rank}</div>
                          </div>
                          <div>
                            <div className="font-medium mb-1">Personal Volume</div>
                            <div className="text-lg font-semibold">{viewingCustomer.personal_volume}</div>
                          </div>
                          <div>
                            <div className="font-medium mb-1">Group Volume</div>
                            <div className="text-lg font-semibold">{viewingCustomer.group_volume}</div>
                          </div>
                          <div>
                            <div className="font-medium mb-1">Team Size</div>
                            <div className="text-lg font-semibold">{viewingCustomer.team_size}</div>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <div className="font-medium mb-2">Update Rank</div>
                          <div className="flex space-x-2">
                            <Select
                              defaultValue={viewingCustomer.rank_id}
                              onValueChange={(value) => updateCustomerRank(viewingCustomer.id, value)}
                            >
                              <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Select rank" />
                              </SelectTrigger>
                              <SelectContent>
                                {ranks.map((rank) => (
                                  <SelectItem key={rank.id} value={rank.id}>
                                    {rank.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button onClick={() => updateCustomerRank(viewingCustomer.id, viewingCustomer.rank_id)}>
                              Apply Rank
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="orders">
                    <div className="text-center py-8 text-muted-foreground">
                      Order history view will be implemented in a future update.
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="team">
                    <div className="text-center py-8 text-muted-foreground">
                      Team members view will be implemented in a future update.
                    </div>
                  </TabsContent>
                </Tabs>
                
                <DialogFooter>
                  <Button onClick={() => setIsDialogOpen(false)}>
                    Close
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    
  );
};

export default CustomersManagement;
