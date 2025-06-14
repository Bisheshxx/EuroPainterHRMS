"use client";

import React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Edit,
  Trash2,
  Users,
  Mail,
  Phone,
  MapPin,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Mock data for demonstration - expanded to show pagination
const mockCustomers = [
  {
    id: "1",
    name: "ABC Construction Co.",
    address: "123 Main Street, Downtown, NY 10001",
    email: "contact@abcconstruction.com",
    phone: "(555) 123-4567",
  },
  {
    id: "2",
    name: "Smith Residential",
    address: "456 Oak Avenue, Suburbia, NY 10002",
    email: "info@smithresidential.com",
    phone: "(555) 234-5678",
  },
  {
    id: "3",
    name: "Metro Office Complex",
    address: "789 Business Blvd, Metro City, NY 10003",
    email: "facilities@metrooffice.com",
    phone: "(555) 345-6789",
  },
  {
    id: "4",
    name: "Green Valley Homes",
    address: "321 Valley Road, Green Valley, NY 10004",
    email: "admin@greenvalleyhomes.com",
    phone: "(555) 456-7890",
  },
  {
    id: "5",
    name: "Tech Startup Inc.",
    address: "654 Innovation Drive, Tech Park, NY 10005",
    email: "hello@techstartup.com",
    phone: "(555) 567-8901",
  },
  {
    id: "6",
    name: "Blue Ocean Enterprises",
    address: "987 Ocean View, Coastal City, NY 10006",
    email: "info@blueocean.com",
    phone: "(555) 678-9012",
  },
  {
    id: "7",
    name: "Mountain Peak Development",
    address: "147 Summit Road, Mountain View, NY 10007",
    email: "contact@mountainpeak.com",
    phone: "(555) 789-0123",
  },
  {
    id: "8",
    name: "Riverside Manufacturing",
    address: "258 River Street, Riverside, NY 10008",
    email: "admin@riverside.com",
    phone: "(555) 890-1234",
  },
  {
    id: "9",
    name: "Sunset Properties",
    address: "369 Sunset Boulevard, West Side, NY 10009",
    email: "info@sunsetproperties.com",
    phone: "(555) 901-2345",
  },
  {
    id: "10",
    name: "Golden Gate Consulting",
    address: "741 Golden Gate Avenue, Financial District, NY 10010",
    email: "hello@goldengate.com",
    phone: "(555) 012-3456",
  },
  {
    id: "11",
    name: "Silver Star Industries",
    address: "852 Silver Star Drive, Industrial Park, NY 10011",
    email: "contact@silverstar.com",
    phone: "(555) 123-4567",
  },
  {
    id: "12",
    name: "Crystal Clear Solutions",
    address: "963 Crystal Avenue, Clear Lake, NY 10012",
    email: "info@crystalclear.com",
    phone: "(555) 234-5678",
  },
  {
    id: "13",
    name: "Diamond Edge Technologies",
    address: "159 Diamond Street, Tech Valley, NY 10013",
    email: "admin@diamondedge.com",
    phone: "(555) 345-6789",
  },
  {
    id: "14",
    name: "Emerald City Real Estate",
    address: "357 Emerald Way, Green District, NY 10014",
    email: "sales@emeraldcity.com",
    phone: "(555) 456-7890",
  },
  {
    id: "15",
    name: "Ruby Red Restaurants",
    address: "468 Ruby Road, Food District, NY 10015",
    email: "info@rubyred.com",
    phone: "(555) 567-8901",
  },
];

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50];

export default function CustomerPage() {
  const [customers, setCustomers] = useState(mockCustomers);
  const [filteredCustomers, setFilteredCustomers] = useState(mockCustomers);
  const [paginatedCustomers, setPaginatedCustomers] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    email: "",
    phone: "",
  });

  // Calculate pagination
  useEffect(() => {
    const total = Math.ceil(filteredCustomers.length / itemsPerPage);
    setTotalPages(total);

    // Reset to page 1 if current page is beyond total pages
    if (currentPage > total && total > 0) {
      setCurrentPage(1);
    }
  }, [filteredCustomers.length, itemsPerPage, currentPage]);

  // Update paginated customers when page or data changes
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedCustomers(filteredCustomers.slice(startIndex, endIndex));
  }, [filteredCustomers, currentPage, itemsPerPage]);

  // Search functionality
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching

    if (!term) {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter(
        customer =>
          customer.name.toLowerCase().includes(term.toLowerCase()) ||
          customer.email.toLowerCase().includes(term.toLowerCase()) ||
          customer.phone.includes(term) ||
          customer.address.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredCustomers(filtered);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingCustomer) {
      // Update existing customer
      const updatedCustomers = customers.map(customer =>
        customer.id === editingCustomer.id
          ? { ...editingCustomer, ...formData }
          : customer
      );
      setCustomers(updatedCustomers);

      // Update filtered customers if search is active
      if (searchTerm) {
        handleSearch(searchTerm);
      } else {
        setFilteredCustomers(updatedCustomers);
      }
    } else {
      // Add new customer
      const newCustomer = {
        id: Date.now().toString(), // In real app, this would be generated by the database
        ...formData,
      };
      const updatedCustomers = [...customers, newCustomer];
      setCustomers(updatedCustomers);

      // Update filtered customers if search is active
      if (searchTerm) {
        handleSearch(searchTerm);
      } else {
        setFilteredCustomers(updatedCustomers);
      }
    }

    // Reset form
    setFormData({
      name: "",
      address: "",
      email: "",
      phone: "",
    });
    setEditingCustomer(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (customer: any) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      address: customer.address,
      email: customer.email,
      phone: customer.phone,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (customer: any) => {
    const updatedCustomers = customers.filter(c => c.id !== customer.id);
    setCustomers(updatedCustomers);

    // Update filtered customers if search is active
    if (searchTerm) {
      handleSearch(searchTerm);
    } else {
      setFilteredCustomers(updatedCustomers);
    }
  };

  const resetForm = () => {
    setEditingCustomer(null);
    setFormData({
      name: "",
      address: "",
      email: "",
      phone: "",
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(
    currentPage * itemsPerPage,
    filteredCustomers.length
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customer Management</h1>
          <p className="text-muted-foreground">
            Manage your customer profiles and contact information
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingCustomer ? "Edit" : "Add"} Customer
              </DialogTitle>
              <DialogDescription>
                {editingCustomer
                  ? "Update the customer information."
                  : "Add a new customer to your database."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Customer Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={e =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter customer name"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={e =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="customer@example.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={e =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={e =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    placeholder="Enter customer address"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">
                  {editingCustomer ? "Update" : "Add"} Customer
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Search Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by name, email, phone, or address..."
                value={searchTerm}
                onChange={e => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            {searchTerm && (
              <p className="text-sm text-muted-foreground mt-2">
                Showing {filteredCustomers.length} of {customers.length}{" "}
                customers
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Customers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
            <p className="text-xs text-muted-foreground">Active customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">With Email</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customers.filter(c => c.email).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Have email addresses
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Customer Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Customer Directory</CardTitle>
              <CardDescription>
                View and manage all customer profiles
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="items-per-page" className="text-sm">
                Show:
              </Label>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={handleItemsPerPageChange}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ITEMS_PER_PAGE_OPTIONS.map(option => (
                    <SelectItem key={option} value={option.toString()}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Contact Info</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCustomers.length > 0 ? (
                paginatedCustomers.map(customer => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">
                      {customer.name}
                    </TableCell>
                    <TableCell>
                      {customer.email ? (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <a
                            href={`mailto:${customer.email}`}
                            className="text-blue-600 hover:underline"
                          >
                            {customer.email}
                          </a>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {customer.phone ? (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <a
                            href={`tel:${customer.phone}`}
                            className="text-blue-600 hover:underline"
                          >
                            {customer.phone}
                          </a>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {customer.address ? (
                        <div className="flex items-start gap-2 max-w-xs">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{customer.address}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {customer.email && (
                          <Badge variant="secondary">Email</Badge>
                        )}
                        {customer.phone && (
                          <Badge variant="secondary">Phone</Badge>
                        )}
                        {customer.address && (
                          <Badge variant="secondary">Address</Badge>
                        )}
                        {!customer.email &&
                          !customer.phone &&
                          !customer.address && (
                            <Badge variant="outline">No contact info</Badge>
                          )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(customer)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(customer)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    {searchTerm
                      ? "No customers found matching your search."
                      : "No customers found. Add your first customer to get started."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex} to {endIndex} of {filteredCustomers.length}{" "}
                customers
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {getPageNumbers().map((page, index) => (
                    <React.Fragment key={index}>
                      {page === "..." ? (
                        <span className="px-2 py-1 text-muted-foreground">
                          ...
                        </span>
                      ) : (
                        <Button
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page as number)}
                          className="w-8 h-8 p-0"
                        >
                          {page}
                        </Button>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
