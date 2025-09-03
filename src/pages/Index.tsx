import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LayoutDashboard, Package, ShoppingCart, Users, BarChart3, ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-muted">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">E-commerce Admin Panel</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Manage your store with a beautiful, minimal interface
          </p>
          <Link to="/admin">
            <Button className="bg-gradient-primary hover:bg-primary-hover shadow-card text-lg px-8 py-3">
              Go to Admin Panel
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="bg-gradient-card shadow-card hover:shadow-hover transition-shadow">
            <CardContent className="p-6 text-center">
              <LayoutDashboard className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Dashboard</h3>
              <p className="text-muted-foreground">Overview of key metrics and analytics</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card hover:shadow-hover transition-shadow">
            <CardContent className="p-6 text-center">
              <Package className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Products</h3>
              <p className="text-muted-foreground">Manage inventory and product catalog</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card hover:shadow-hover transition-shadow">
            <CardContent className="p-6 text-center">
              <ShoppingCart className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Orders</h3>
              <p className="text-muted-foreground">Track and process customer orders</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card hover:shadow-hover transition-shadow">
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Customers</h3>
              <p className="text-muted-foreground">Manage customer relationships</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card hover:shadow-hover transition-shadow">
            <CardContent className="p-6 text-center">
              <BarChart3 className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Analytics</h3>
              <p className="text-muted-foreground">Detailed reports and insights</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
