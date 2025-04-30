import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LanguageContext } from "@/context/language-context";
import { AuthContext } from "@/context/auth-context";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import {
  CircleCheck,
  CircleX,
  Clock,
  Edit,
  Eye,
  Search,
  Store,
  Trash2,
  UserCog,
  Filter,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  MoreHorizontal,
  BadgeCheck,
  X,
} from "lucide-react";

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
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminLayout } from "@/components/layout/admin-layout";

// Types
interface SellerProfile {
  id: number;
  userId: number;
  storeName: string;
  storeNameAr?: string;
  businessType: string;
  taxId: string;
  description: string;
  descriptionAr?: string;
  logo?: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  status: "pending" | "approved" | "rejected";
  statusReason?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt?: string;
}

interface SellerDetailsDialogProps {
  seller: SellerProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

interface StatusUpdateDialogProps {
  seller: SellerProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (status: string, reason: string) => void;
  isUpdating: boolean;
}

interface DeleteConfirmationDialogProps {
  seller: SellerProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case "approved":
      return (
        <Badge className="bg-green-500/20 text-green-500 border-green-500/40 hover:bg-green-500/30">
          <CircleCheck className="w-3.5 h-3.5 mr-1" />
          Approved
        </Badge>
      );
    case "rejected":
      return (
        <Badge className="bg-red-500/20 text-red-500 border-red-500/40 hover:bg-red-500/30">
          <CircleX className="w-3.5 h-3.5 mr-1" />
          Rejected
        </Badge>
      );
    case "pending":
    default:
      return (
        <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/40 hover:bg-yellow-500/30">
          <Clock className="w-3.5 h-3.5 mr-1" />
          Pending
        </Badge>
      );
  }
};

// Seller details dialog
const SellerDetailsDialog = ({ seller, isOpen, onClose }: SellerDetailsDialogProps) => {
  const { language } = useContext(LanguageContext);
  
  if (!seller) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-darkBlue border-gray-700 max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Store className="h-5 w-5 mr-2 text-primary" />
            {seller.storeName}
            {seller.isVerified && (
              <BadgeCheck className="h-5 w-5 ml-2 text-blue-500" />
            )}
          </DialogTitle>
          <DialogDescription>
            {seller.storeNameAr && (
              <div className="text-right text-gray-400 dir-rtl">{seller.storeNameAr}</div>
            )}
            <div className="mt-2 flex items-center">
              <StatusBadge status={seller.status} />
              <span className="text-gray-400 text-sm ml-3">
                ID: {seller.id} • Registered: {new Date(seller.createdAt).toLocaleDateString()}
              </span>
            </div>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">Business Type</h3>
              <p>{seller.businessType}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">Tax ID</h3>
              <p>{seller.taxId}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">Contact Email</h3>
              <p>{seller.contactEmail}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">Contact Phone</h3>
              <p>{seller.contactPhone}</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-1">Office Address</h3>
            <p>{seller.address}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-1">Store Description</h3>
            <p>{seller.description}</p>
            {seller.descriptionAr && (
              <div className="mt-2 text-gray-400 dir-rtl">{seller.descriptionAr}</div>
            )}
          </div>
          
          {seller.status === "rejected" && seller.statusReason && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-md p-4">
              <h3 className="text-sm font-medium text-red-400 flex items-center mb-1">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Rejection Reason
              </h3>
              <p className="text-gray-300">{seller.statusReason}</p>
            </div>
          )}
          
          {seller.status === "approved" && seller.statusReason && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-md p-4">
              <h3 className="text-sm font-medium text-green-400 flex items-center mb-1">
                <CircleCheck className="h-4 w-4 mr-2" />
                Approval Notes
              </h3>
              <p className="text-gray-300">{seller.statusReason}</p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Status update dialog
const StatusUpdateDialog = ({ 
  seller, 
  isOpen, 
  onClose, 
  onSubmit, 
  isUpdating 
}: StatusUpdateDialogProps) => {
  const [status, setStatus] = useState<string>("pending");
  const [reason, setReason] = useState<string>("");
  
  useEffect(() => {
    if (seller) {
      setStatus(seller.status);
      setReason(seller.statusReason || "");
    }
  }, [seller]);
  
  if (!seller) return null;
  
  const handleSubmit = () => {
    onSubmit(status, reason);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-darkBlue border-gray-700">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <UserCog className="h-5 w-5 mr-2 text-primary" />
            Update Seller Status
          </DialogTitle>
          <DialogDescription>
            {seller.storeName} (ID: {seller.id})
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={status}
              onValueChange={setStatus}
            >
              <SelectTrigger className="bg-mediumBlue border-gray-700">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-darkBlue border-gray-700">
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reason">
              {status === "rejected" ? "Rejection Reason" : "Notes (Optional)"}
            </Label>
            <Textarea
              id="reason"
              placeholder={
                status === "rejected"
                  ? "Provide a reason for rejection..."
                  : "Add any notes or comments..."
              }
              className="bg-mediumBlue border-gray-700 min-h-24"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={status === "rejected" && !reason.trim() || isUpdating}
          >
            {isUpdating ? "Updating..." : "Update Status"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Delete confirmation dialog
const DeleteConfirmationDialog = ({ 
  seller, 
  isOpen, 
  onClose, 
  onConfirm, 
  isDeleting 
}: DeleteConfirmationDialogProps) => {
  if (!seller) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-darkBlue border-gray-700">
        <DialogHeader>
          <DialogTitle className="flex items-center text-red-500">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Delete Seller
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the seller account and remove their data from our servers.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <p className="mb-4">
            Are you sure you want to delete the seller account for:
          </p>
          <div className="bg-mediumBlue p-3 rounded-md">
            <p className="font-medium">{seller.storeName}</p>
            <p className="text-sm text-gray-400">ID: {seller.id}</p>
          </div>
        </div>
        
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Seller"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default function SellerManagement() {
  const { t, language } = useContext(LanguageContext);
  const { userData, isAuthenticated, isAdmin } = useContext(AuthContext);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Local state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSeller, setSelectedSeller] = useState<SellerProfile | null>(null);
  
  // Dialogs state
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Pagination
  const pageSize = 10;
  
  // Fetch sellers query
  const {
    data: sellersData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["/api/admin/sellers", statusFilter !== "all" ? statusFilter : null],
    queryFn: async () => {
      const url = `/api/admin/sellers${statusFilter !== "all" ? `?status=${statusFilter}` : ""}`;
      const response = await apiRequest("GET", url);
      if (!response.ok) {
        throw new Error("Failed to fetch sellers");
      }
      return response.json();
    },
    enabled: isAuthenticated && isAdmin,
  });
  
  // Status update mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ 
      sellerId, 
      status, 
      statusReason 
    }: { 
      sellerId: number; 
      status: string; 
      statusReason: string 
    }) => {
      const response = await apiRequest("PUT", `/api/admin/sellers/${sellerId}/status`, {
        status,
        statusReason,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update seller status");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Status updated",
        description: "Seller status has been updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/sellers"] });
      setIsStatusDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Delete seller mutation
  const deleteSellerMutation = useMutation({
    mutationFn: async (sellerId: number) => {
      const response = await apiRequest("DELETE", `/api/admin/sellers/${sellerId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete seller");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Seller deleted",
        description: "Seller account has been deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/sellers"] });
      setIsDeleteDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Filter sellers based on search query
  const filteredSellers = sellersData ? sellersData.filter((seller: SellerProfile) => {
    const searchFields = [
      seller.storeName,
      seller.storeNameAr,
      seller.contactEmail,
      seller.contactPhone,
      seller.taxId,
      seller.businessType,
    ].filter(Boolean).join(" ").toLowerCase();
    
    return searchFields.includes(searchQuery.toLowerCase());
  }) : [];
  
  // Pagination
  const totalPages = Math.ceil(filteredSellers.length / pageSize);
  const paginatedSellers = filteredSellers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  
  // Handle status update
  const handleStatusUpdate = (status: string, reason: string) => {
    if (!selectedSeller) return;
    
    updateStatusMutation.mutate({
      sellerId: selectedSeller.id,
      status,
      statusReason: reason,
    });
  };
  
  // Handle seller deletion
  const handleDeleteSeller = () => {
    if (!selectedSeller) return;
    
    deleteSellerMutation.mutate(selectedSeller.id);
  };
  
  // If not admin, show access denied
  if (!isAdmin) {
    return (
      <AdminLayout>
        <div className="container mx-auto py-10">
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-8 text-center">
            <AlertTriangle className="h-12 w-12 mx-auto text-red-500 mb-4" />
            <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
            <p className="text-gray-300">
              You do not have permission to access this page. This area is restricted to administrators only.
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="container mx-auto py-8 px-4"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <Store className="h-8 w-8 mr-2 text-primary" />
              Seller Management
            </h1>
            <p className="text-gray-400 mt-1">
              Manage seller accounts, approve or reject applications
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search sellers..."
                className="pl-9 bg-mediumBlue border-gray-700 w-full"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
                }}
              />
            </div>
            
            <Select 
              value={statusFilter} 
              onValueChange={(value) => {
                setStatusFilter(value);
                setCurrentPage(1); // Reset to first page on filter change
              }}
            >
              <SelectTrigger className="w-full sm:w-[160px] bg-mediumBlue border-gray-700">
                <div className="flex items-center">
                  <Filter className="h-4 w-4 mr-2 text-gray-400" />
                  <SelectValue placeholder="Filter by status" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-darkBlue border-gray-700">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {isLoading ? (
          <div className="bg-mediumBlue rounded-lg border border-gray-700 p-12 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-300">Loading seller accounts...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-8 text-center">
            <AlertTriangle className="h-12 w-12 mx-auto text-red-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">Error Loading Sellers</h3>
            <p className="text-gray-300 mb-4">
              {(error as Error).message || "Failed to load seller accounts. Please try again."}
            </p>
            <Button
              onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/admin/sellers"] })}
            >
              Try Again
            </Button>
          </div>
        ) : filteredSellers.length === 0 ? (
          <div className="bg-mediumBlue rounded-lg border border-gray-700 p-12 text-center">
            <Store className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">
              {searchQuery
                ? "No sellers found matching your search"
                : statusFilter !== "all"
                ? `No sellers with status: ${statusFilter}`
                : "No sellers found"}
            </h3>
            <p className="text-gray-300 mb-4">
              {searchQuery
                ? "Try a different search term or clear the search"
                : statusFilter !== "all"
                ? "Try a different status filter"
                : "There are no seller accounts in the system yet."}
            </p>
            {(searchQuery || statusFilter !== "all") && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="bg-mediumBlue rounded-lg border border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-darkBlue">
                    <TableRow>
                      <TableHead>Store Name</TableHead>
                      <TableHead>Business Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedSellers.map((seller: SellerProfile) => (
                      <TableRow key={seller.id} className="hover:bg-darkBlue/50">
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <span>{seller.storeName}</span>
                            {seller.isVerified && (
                              <BadgeCheck className="h-4 w-4 ml-1 text-blue-500" title="Verified" />
                            )}
                          </div>
                          {seller.storeNameAr && (
                            <span className="text-sm text-gray-400">{seller.storeNameAr}</span>
                          )}
                        </TableCell>
                        <TableCell>{seller.businessType}</TableCell>
                        <TableCell>
                          <StatusBadge status={seller.status} />
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{seller.contactEmail}</div>
                            <div className="text-gray-400">{seller.contactPhone}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(seller.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-darkBlue border-gray-700">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator className="bg-gray-700" />
                              <DropdownMenuItem
                                className="gap-2 cursor-pointer"
                                onClick={() => {
                                  setSelectedSeller(seller);
                                  setIsDetailsDialogOpen(true);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="gap-2 cursor-pointer"
                                onClick={() => {
                                  setSelectedSeller(seller);
                                  setIsStatusDialogOpen(true);
                                }}
                              >
                                <UserCog className="h-4 w-4" />
                                Update Status
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-gray-700" />
                              <DropdownMenuItem
                                className="gap-2 text-red-500 cursor-pointer"
                                onClick={() => {
                                  setSelectedSeller(seller);
                                  setIsDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete Seller
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-4 border-t border-gray-700">
                  <div className="text-sm text-gray-400">
                    Showing {(currentPage - 1) * pageSize + 1} to{" "}
                    {Math.min(currentPage * pageSize, filteredSellers.length)} of{" "}
                    {filteredSellers.length} sellers
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span className="sr-only">Previous Page</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronRight className="h-4 w-4" />
                      <span className="sr-only">Next Page</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Status counts */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="bg-mediumBlue rounded-lg border border-gray-700 p-4">
                <h3 className="text-sm font-medium text-gray-400 mb-1 flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-yellow-500" />
                  Pending Applications
                </h3>
                <p className="text-2xl font-bold">
                  {sellersData.filter((s: SellerProfile) => s.status === "pending").length}
                </p>
              </div>
              <div className="bg-mediumBlue rounded-lg border border-gray-700 p-4">
                <h3 className="text-sm font-medium text-gray-400 mb-1 flex items-center">
                  <CircleCheck className="h-4 w-4 mr-2 text-green-500" />
                  Approved Sellers
                </h3>
                <p className="text-2xl font-bold">
                  {sellersData.filter((s: SellerProfile) => s.status === "approved").length}
                </p>
              </div>
              <div className="bg-mediumBlue rounded-lg border border-gray-700 p-4">
                <h3 className="text-sm font-medium text-gray-400 mb-1 flex items-center">
                  <CircleX className="h-4 w-4 mr-2 text-red-500" />
                  Rejected Applications
                </h3>
                <p className="text-2xl font-bold">
                  {sellersData.filter((s: SellerProfile) => s.status === "rejected").length}
                </p>
              </div>
            </div>
          </>
        )}
      
        {/* Dialogs */}
        <SellerDetailsDialog
          seller={selectedSeller}
          isOpen={isDetailsDialogOpen}
          onClose={() => setIsDetailsDialogOpen(false)}
        />
        
        <StatusUpdateDialog
          seller={selectedSeller}
          isOpen={isStatusDialogOpen}
          onClose={() => setIsStatusDialogOpen(false)}
          onSubmit={handleStatusUpdate}
          isUpdating={updateStatusMutation.isPending}
        />
        
        <DeleteConfirmationDialog
          seller={selectedSeller}
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDeleteSeller}
          isDeleting={deleteSellerMutation.isPending}
        />
      </motion.div>
    </AdminLayout>
  );
}