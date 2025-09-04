import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, Eye, Mail, Users, UserCheck, Star } from "lucide-react";

interface Customer {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  orders: number;
  totalSpent: number;
  status: "active" | "inactive";
  lastOrder: string;
  rating: number;
}

const customers: Customer[] = [
  {
    id: "CUST-001",
    name: "John Doe",
    email: "john@example.com",
    joinDate: "2023-05-15",
    orders: 12,
    totalSpent: 2499.99,
    status: "active",
    lastOrder: "2024-01-15",
    rating: 4.8,
  },
  {
    id: "CUST-002", 
    name: "Sarah Johnson",
    email: "sarah@example.com",
    joinDate: "2023-08-22",
    orders: 8,
    totalSpent: 1299.50,
    status: "active",
    lastOrder: "2024-01-14",
    rating: 4.9,
  },
  {
    id: "CUST-003",
    name: "Mike Chen",
    email: "mike@example.com", 
    joinDate: "2023-03-10",
    orders: 15,
    totalSpent: 3200.75,
    status: "active",
    lastOrder: "2024-01-12",
    rating: 4.7,
  },
  {
    id: "CUST-004",
    name: "Emily Davis",
    email: "emily@example.com",
    joinDate: "2023-11-05",
    orders: 3,
    totalSpent: 189.99,
    status: "active",
    lastOrder: "2024-01-10",
    rating: 4.5,
  },
  {
    id: "CUST-005",
    name: "Alex Wilson",
    email: "alex@example.com",
    joinDate: "2022-12-18",
    orders: 22,
    totalSpent: 4567.88,
    status: "inactive",
    lastOrder: "2023-10-15",
    rating: 4.6,
  },
];

const getStatusColor = (status: Customer["status"]) => {
  switch (status) {
    case "active":
      return "bg-success/10 text-success hover:bg-success/20";
    case "inactive":
      return "bg-muted text-muted-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getCustomerTier = (totalSpent: number) => {
  if (totalSpent >= 3000) return { tier: "VIP", color: "bg-yellow-500/10 text-yellow-600" };
  if (totalSpent >= 1000) return { tier: "Gold", color: "bg-orange-500/10 text-orange-600" };
  if (totalSpent >= 500) return { tier: "Silver", color: "bg-gray-500/10 text-gray-600" };
  return { tier: "Bronze", color: "bg-amber-600/10 text-amber-700" };
};

export default function Customers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCustomers] = useState(customers);

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === "active").length;
  const averageOrderValue = customers.reduce((sum, c) => sum + (c.totalSpent / c.orders), 0) / customers.length;
  const topSpender = Math.max(...customers.map(c => c.totalSpent));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Customers</h1>
        <p className="text-muted-foreground mt-2">Manage your customer relationships and insights.</p>
      </div>

      {/* Customer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-card shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{totalCustomers}</div>
                <p className="text-sm text-muted-foreground">Total Customers</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <UserCheck className="h-5 w-5 text-success" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{activeCustomers}</div>
                <p className="text-sm text-muted-foreground">Active Customers</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/10 rounded-lg">
                <Star className="h-5 w-5 text-warning" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">${averageOrderValue.toFixed(0)}</div>
                <p className="text-sm text-muted-foreground">Avg Order Value</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">${topSpender}</div>
                <p className="text-sm text-muted-foreground">Top Spender</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="bg-card shadow-card">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background border-border focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <Button variant="outline" className="border-border hover:bg-muted">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card className="bg-card shadow-card">
        <CardHeader>
          <CardTitle>Customer Directory</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-muted-foreground font-medium">Customer</TableHead>
                <TableHead className="text-muted-foreground font-medium">Join Date</TableHead>
                <TableHead className="text-muted-foreground font-medium">Orders</TableHead>
                <TableHead className="text-muted-foreground font-medium">Total Spent</TableHead>
                <TableHead className="text-muted-foreground font-medium">Tier</TableHead>
                <TableHead className="text-muted-foreground font-medium">Rating</TableHead>
                <TableHead className="text-muted-foreground font-medium">Status</TableHead>
                <TableHead className="text-muted-foreground font-medium text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => {
                const tier = getCustomerTier(customer.totalSpent);
                return (
                  <TableRow key={customer.id} className="border-border hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-primary font-medium text-sm">
                            {customer.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{customer.name}</p>
                          <p className="text-sm text-muted-foreground">{customer.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(customer.joinDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-medium text-foreground">{customer.orders}</TableCell>
                    <TableCell className="font-medium text-foreground">${customer.totalSpent}</TableCell>
                    <TableCell>
                      <Badge className={tier.color}>{tier.tier}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium text-foreground">{customer.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(customer.status)}>
                        {customer.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                          <Mail className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}