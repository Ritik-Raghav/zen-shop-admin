import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, Eye, Package, Truck, CheckCircle } from "lucide-react";

interface Order {
  id: string;
  customer: string;
  email: string;
  date: string;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  items: number;
  payment: "paid" | "pending" | "failed";
}

const orders: Order[] = [
  {
    id: "ORD-001",
    customer: "John Doe",
    email: "john@example.com", 
    date: "2024-01-15",
    total: 299.99,
    status: "delivered",
    items: 3,
    payment: "paid",
  },
  {
    id: "ORD-002",
    customer: "Sarah Johnson",
    email: "sarah@example.com",
    date: "2024-01-14",
    total: 89.50,
    status: "shipped",
    items: 1,
    payment: "paid",
  },
  {
    id: "ORD-003",
    customer: "Mike Chen",
    email: "mike@example.com",
    date: "2024-01-14",
    total: 159.99,
    status: "processing",
    items: 2,
    payment: "paid",
  },
  {
    id: "ORD-004",
    customer: "Emily Davis",
    email: "emily@example.com",
    date: "2024-01-13",
    total: 45.00,
    status: "pending",
    items: 1,
    payment: "pending",
  },
  {
    id: "ORD-005",
    customer: "Alex Wilson",
    email: "alex@example.com",
    date: "2024-01-13",
    total: 199.99,
    status: "cancelled",
    items: 1,
    payment: "failed",
  },
];

const getStatusColor = (status: Order["status"]) => {
  switch (status) {
    case "pending":
      return "bg-warning/10 text-warning hover:bg-warning/20";
    case "processing":
      return "bg-primary/10 text-primary hover:bg-primary/20";
    case "shipped":
      return "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20";
    case "delivered":
      return "bg-success/10 text-success hover:bg-success/20";
    case "cancelled":
      return "bg-destructive/10 text-destructive hover:bg-destructive/20";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getPaymentColor = (payment: Order["payment"]) => {
  switch (payment) {
    case "paid":
      return "bg-success/10 text-success";
    case "pending":
      return "bg-warning/10 text-warning";
    case "failed":
      return "bg-destructive/10 text-destructive";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getStatusIcon = (status: Order["status"]) => {
  switch (status) {
    case "pending":
      return <Package className="h-3 w-3" />;
    case "processing":
      return <Package className="h-3 w-3" />;
    case "shipped":
      return <Truck className="h-3 w-3" />;
    case "delivered":
      return <CheckCircle className="h-3 w-3" />;
    case "cancelled":
      return <Package className="h-3 w-3" />;
    default:
      return <Package className="h-3 w-3" />;
  }
};

export default function Orders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOrders] = useState(orders);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Orders</h1>
        <p className="text-muted-foreground mt-2">Track and manage customer orders.</p>
      </div>

      {/* Order Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-card shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/10 rounded-lg">
                <Package className="h-5 w-5 text-warning" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {orders.filter(o => o.status === "pending").length}
                </div>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {orders.filter(o => o.status === "processing").length}
                </div>
                <p className="text-sm text-muted-foreground">Processing</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Truck className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {orders.filter(o => o.status === "shipped").length}
                </div>
                <p className="text-sm text-muted-foreground">Shipped</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {orders.filter(o => o.status === "delivered").length}
                </div>
                <p className="text-sm text-muted-foreground">Delivered</p>
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
                placeholder="Search orders..."
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

      {/* Orders Table */}
      <Card className="bg-card shadow-card">
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-muted-foreground font-medium">Order ID</TableHead>
                <TableHead className="text-muted-foreground font-medium">Customer</TableHead>
                <TableHead className="text-muted-foreground font-medium">Date</TableHead>
                <TableHead className="text-muted-foreground font-medium">Items</TableHead>
                <TableHead className="text-muted-foreground font-medium">Total</TableHead>
                <TableHead className="text-muted-foreground font-medium">Status</TableHead>
                <TableHead className="text-muted-foreground font-medium">Payment</TableHead>
                <TableHead className="text-muted-foreground font-medium text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id} className="border-border hover:bg-muted/50">
                  <TableCell>
                    <div className="font-mono text-sm font-medium text-foreground">{order.id}</div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{order.customer}</p>
                      <p className="text-sm text-muted-foreground">{order.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(order.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{order.items}</TableCell>
                  <TableCell className="font-medium text-foreground">${order.total}</TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(order.status)} flex items-center gap-1 w-fit`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPaymentColor(order.payment)}>
                      {order.payment}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}