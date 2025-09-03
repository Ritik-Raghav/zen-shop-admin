import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Edit, Trash2, Eye, Filter } from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "active" | "inactive" | "out-of-stock";
  image: string;
  sales: number;
}

const products: Product[] = [
  {
    id: "1",
    name: "iPhone 15 Pro",
    category: "Electronics",
    price: 999.99,
    stock: 45,
    status: "active",
    image: "📱",
    sales: 234,
  },
  {
    id: "2",
    name: "MacBook Air M2",
    category: "Electronics",
    price: 1199.99,
    stock: 12,
    status: "active",
    image: "💻",
    sales: 89,
  },
  {
    id: "3",
    name: "Nike Air Max 90",
    category: "Clothing",
    price: 129.99,
    stock: 0,
    status: "out-of-stock",
    image: "👟",
    sales: 156,
  },
  {
    id: "4",
    name: "Coffee Mug Set",
    category: "Home",
    price: 39.99,
    stock: 67,
    status: "active",
    image: "☕",
    sales: 78,
  },
  {
    id: "5",
    name: "Wireless Headphones",
    category: "Electronics",
    price: 199.99,
    stock: 23,
    status: "active",
    image: "🎧",
    sales: 145,
  },
];

const getStatusColor = (status: Product["status"]) => {
  switch (status) {
    case "active":
      return "bg-success/10 text-success hover:bg-success/20";
    case "inactive":
      return "bg-muted text-muted-foreground";
    case "out-of-stock":
      return "bg-destructive/10 text-destructive hover:bg-destructive/20";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export default function Products() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts] = useState(products);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground mt-2">Manage your product inventory and catalog.</p>
        </div>
        <Button className="bg-gradient-primary hover:bg-primary-hover shadow-card">
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Filters and Search */}
      <Card className="bg-gradient-card shadow-card">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
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

      {/* Products Table */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle>Product Inventory</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-muted-foreground font-medium">Product</TableHead>
                <TableHead className="text-muted-foreground font-medium">Category</TableHead>
                <TableHead className="text-muted-foreground font-medium">Price</TableHead>
                <TableHead className="text-muted-foreground font-medium">Stock</TableHead>
                <TableHead className="text-muted-foreground font-medium">Status</TableHead>
                <TableHead className="text-muted-foreground font-medium">Sales</TableHead>
                <TableHead className="text-muted-foreground font-medium text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id} className="border-border hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center text-lg">
                        {product.image}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{product.name}</p>
                        <p className="text-sm text-muted-foreground">ID: {product.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{product.category}</TableCell>
                  <TableCell className="font-medium text-foreground">${product.price}</TableCell>
                  <TableCell>
                    <span className={`font-medium ${product.stock < 20 ? "text-warning" : "text-foreground"}`}>
                      {product.stock}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(product.status)}>
                      {product.status.replace("-", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{product.sales}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-card shadow-card">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-foreground">{products.length}</div>
            <p className="text-sm text-muted-foreground">Total Products</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card shadow-card">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-success">
              {products.filter(p => p.status === "active").length}
            </div>
            <p className="text-sm text-muted-foreground">Active Products</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card shadow-card">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-warning">
              {products.filter(p => p.stock < 20).length}
            </div>
            <p className="text-sm text-muted-foreground">Low Stock</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card shadow-card">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-destructive">
              {products.filter(p => p.status === "out-of-stock").length}
            </div>
            <p className="text-sm text-muted-foreground">Out of Stock</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}