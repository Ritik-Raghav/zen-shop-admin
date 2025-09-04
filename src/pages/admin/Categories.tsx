import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Search, Plus, Edit, Trash2, Eye, Filter } from "lucide-react";

const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:3000/api";
const imageUrl = import.meta.env.VITE_IMAGE_URL || "http://localhost:3000";

interface Category {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
  products: number;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

interface Summary {
  total: number;
  active: number;
  inactive: number;
}

export default function Categories() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [summary, setSummary] = useState<Summary>({
    total: 0,
    active: 0,
    inactive: 0,
  });
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [editOpen, setEditOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);

  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editImage, setEditImage] = useState<File | null>(null);

  const token = localStorage.getItem("token");

  // Open Edit Modal
  const handleEditClick = (category: Category) => {
    setCurrentCategory(category);
    setEditName(category.name);
    setEditDescription(category.description);
    setEditImage(null);
    setEditOpen(true);
  };

  // Submit updated category
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCategory) return;

    const formData = new FormData();
    formData.append("name", editName);
    formData.append("description", editDescription);
    if (editImage) formData.append("image", editImage);

    try {
      const res = await fetch(
        `${baseUrl}/admin/update-category/${currentCategory._id}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );
      const data = await res.json();
      if (res.ok) {
        // Update local state with new category info
        setCategories((prev) =>
          prev.map((cat) =>
            cat._id === currentCategory._id
              ? {
                  ...cat,
                  name: editName,
                  description: editDescription,
                  image: data.category.image,
                }
              : cat
          )
        );

        setEditOpen(false);
      } else {
        alert(data.error || "Failed to update category");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  // Fetch categories from API
  const fetchCategories = async (query: string = "") => {
    try {
      const url = query
        ? `${baseUrl}/admin/get-all-categories?q=${encodeURIComponent(query)}`
        : `${baseUrl}/admin/get-all-categories`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setCategories(data.categories);
        setSummary(data.summary);
      } else {
        alert(data.error || "Failed to fetch categories");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while fetching categories");
    }
  };

  useEffect(() => {
    if (!token) return;

    const delay = setTimeout(() => {
      fetchCategories(searchTerm);
    }, 100); // debounce

    return () => clearTimeout(delay);
  }, [token, searchTerm]);

  // const filteredCategories = categories.filter((c) =>
  //   c.name.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  const getStatusColor = (status: boolean) =>
    status
      ? "bg-success/10 text-success hover:bg-success/20"
      : "bg-muted text-muted-foreground";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return alert("Category name is required");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    if (image) formData.append("image", image);

    try {
      setLoading(true);
      const res = await fetch(`${baseUrl}/admin/create-category`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        // Re-fetch categories to reflect latest data and stats
        await fetchCategories();

        setName("");
        setDescription("");
        setImage(null);
        setOpen(false);

        setSuccessMessage("Category added successfully!");
        setSuccessOpen(true);
      } else {
        alert(data.error || "Failed to create category");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      setLoading(true);
      const res = await fetch(`${baseUrl}/admin/delete-category/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok) {
        // Remove deleted category from state
        setCategories((prev) => prev.filter((c) => c._id !== id));
        setSummary((prev) => ({
          ...prev,
          total: prev.total - 1,
          active:
            prev.active -
            (categories.find((c) => c._id === id)?.isActive ? 1 : 0),
          inactive:
            prev.inactive -
            (!categories.find((c) => c._id === id)?.isActive ? 1 : 0),
        }));
        setSuccessMessage("Category deleted successfully!");
        setSuccessOpen(true);
      } else {
        alert(data.error || "Failed to delete category");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while deleting category");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`${baseUrl}/admin/toggle-category-status/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      const data = await res.json();

      if (res.ok) {
        // Update local state without refreshing
        setCategories((prev) =>
          prev.map((cat) =>
            cat._id === id ? { ...cat, isActive: !currentStatus } : cat
          )
        );
        setSummary((prev) => ({
          ...prev,
          active: !currentStatus ? prev.active + 1 : prev.active - 1,
          inactive: !currentStatus ? prev.inactive - 1 : prev.inactive + 1,
        }));
      } else {
        alert(data.error || "Failed to update status");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while updating status");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Categories</h1>
          <p className="text-muted-foreground mt-2">
            Manage product categories for your store.
          </p>
        </div>
        <Button
          className="bg-primary hover:bg-primary-hover shadow-card"
          onClick={() => setOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Search + Filter */}
      <Card className="bg-card shadow-card">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search categories..."
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

      {/* Categories Table */}
      <Card className="bg-card shadow-card">
        <CardHeader>
          <CardTitle>Category List</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-muted-foreground font-medium">
                  S.No.
                </TableHead>
                <TableHead className="text-muted-foreground font-medium">
                  Category
                </TableHead>
                <TableHead className="text-muted-foreground font-medium">
                  Description
                </TableHead>

                <TableHead className="text-muted-foreground font-medium">
                  Products
                </TableHead>
                <TableHead className="text-muted-foreground font-medium">
                  Status
                </TableHead>
                <TableHead className="text-muted-foreground font-medium text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category, index) => (
                <TableRow
                  key={category._id}
                  className="border-border hover:bg-muted/50"
                >
                  <TableCell>{index + 1}</TableCell> {/* S.No. */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {category.image && (
                        <img
                          src={`${imageUrl}${category.image}`}
                          alt={category.name}
                          className="w-8 h-8 object-cover rounded"
                        />
                      )}
                      <div>
                        <p className="font-medium text-foreground">
                          {category.name}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {category.description}
                  </TableCell>
                  <TableCell className="font-medium text-foreground">
                    {category.products}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {/* Toggle Switch */}
                      <label className="inline-flex relative items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={category.isActive}
                          onChange={() =>
                            handleToggleStatus(category._id, category.isActive)
                          }
                        />
                        <div className="w-11 h-6 bg-gray-300 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:bg-success/80 dark:peer-checked:bg-success/70 transition-all"></div>
                        <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white dark:bg-gray-200 rounded-full shadow-md peer-checked:translate-x-5 transition-transform"></div>
                      </label>

                      {/* Status Text */}
                      {/* <span
      className={`text-sm font-medium ${
        category.isActive
          ? "text-success"
          : "text-muted-foreground dark:text-gray-400"
      }`}
    >
      {category.isActive ? "Active" : "Inactive"}
    </span> */}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-foreground"
                        onClick={() => handleEditClick(category)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(category._id)}
                      >
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card shadow-card">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-foreground">
              {summary.total}
            </div>
            <p className="text-sm text-muted-foreground">Total Categories</p>
          </CardContent>
        </Card>
        <Card className="bg-card shadow-card">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-success">
              {summary.active}
            </div>
            <p className="text-sm text-muted-foreground">Active Categories</p>
          </CardContent>
        </Card>
        <Card className="bg-card shadow-card">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-muted-foreground">
              {summary.inactive}
            </div>
            <p className="text-sm text-muted-foreground">Inactive Categories</p>
          </CardContent>
        </Card>
      </div>

      {/* Add Category Popup */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md mx-auto rounded-xl shadow-xl border border-border bg-card animate-fade-in">
          <DialogHeader className="border-b border-border px-6 py-4">
            <DialogTitle className="text-lg font-bold text-foreground">
              Add New Category
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 px-6 py-5">
            {/* Name */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-muted-foreground mb-2">
                Name
              </label>
              <Input
                placeholder="Enter category name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border-border focus:ring-2 focus:ring-primary/30 rounded-md transition-all"
              />
            </div>

            {/* Description */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-muted-foreground mb-2">
                Description
              </label>
              <Textarea
                placeholder="Enter category description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border-border focus:ring-2 focus:ring-primary/30 rounded-md resize-none transition-all"
                rows={4}
              />
            </div>

            {/* Image */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-muted-foreground mb-2">
                Image
              </label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                className="border-border focus:ring-2 focus:ring-primary/30 rounded-md transition-all"
              />
            </div>

            {/* Footer Buttons */}
            <DialogFooter className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                className="hover:bg-muted transition-all"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-primary text-primary-foreground hover:bg-primary-hover dark:bg-primary-dark dark:text-primary-foreground-dark dark:hover:bg-primary-dark-hover transition-all"
              >
                {loading ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Success Popup */}
      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="max-w-sm mx-auto rounded-xl shadow-xl border border-green-200 animate-fade-in bg-white">
          <DialogHeader className="flex flex-col items-center gap-2 pt-6">
            <div className="w-16 h-16 flex items-center justify-center bg-green-100 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <DialogTitle className="text-xl font-bold text-green-700">
              Success!
            </DialogTitle>
            <p className="text-green-600 text-center text-sm px-4">
              {successMessage}
            </p>
          </DialogHeader>
          <DialogFooter className="flex justify-center pt-4 pb-6">
            <Button
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-md transition-all"
              onClick={() => setSuccessOpen(false)}
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Modal */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-md mx-auto rounded-xl shadow-xl border border-border bg-card animate-fade-in">
          <DialogHeader className="border-b border-border px-6 py-4">
            <DialogTitle className="text-lg font-bold text-foreground">
              Edit Category
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="space-y-6 px-6 py-5">
            {/* Name */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-muted-foreground mb-2">
                Name
              </label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
                className="border-border focus:ring-2 focus:ring-primary/30 rounded-md transition-all"
                placeholder="Enter category name"
              />
            </div>

            {/* Description */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-muted-foreground mb-2">
                Description
              </label>
              <Textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="border-border focus:ring-2 focus:ring-primary/30 rounded-md resize-none transition-all"
                rows={4}
                placeholder="Enter category description"
              />
            </div>

            {/* Image */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-muted-foreground mb-2">
                Image
              </label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setEditImage(e.target.files?.[0] || null)}
                className="border-border focus:ring-2 focus:ring-primary/30 rounded-md transition-all"
              />
            </div>

            {/* Footer Buttons */}
            <DialogFooter className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                className="hover:bg-muted transition-all"
                onClick={() => setEditOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-primary text-primary-foreground hover:bg-primary-hover dark:bg-primary-dark dark:text-primary-foreground-dark dark:hover:bg-primary-dark-hover transition-all"
              >
                Update
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
