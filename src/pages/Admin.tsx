import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Settings, Package, Users, BarChart3, Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import CSVUpload from "@/components/CSVUpload";
import { useAdminStats } from "@/hooks/useAdminStats";
import { useProducts } from "@/hooks/useProducts";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const Admin = () => {
  const { stats, loading: statsLoading } = useAdminStats();
  const { products, loading: productsLoading, refetch: refetchProducts } = useProducts();
  const [users, setUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);

  // Fetch users for user management
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setUsersLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select(`
            id,
            first_name,
            last_name,
            display_name,
            created_at,
            user_roles (role)
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setUsers(data || []);
      } catch (err) {
        console.error('Error fetching users:', err);
      } finally {
        setUsersLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <AdminProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 mb-8">
              <Settings className="h-6 w-6" />
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            </div>

            {/* Real-time Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {statsLoading ? (
                      <div className="flex items-center">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Loading...
                      </div>
                    ) : (
                      stats.totalProducts.toLocaleString()
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">Active products in catalog</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {statsLoading ? (
                      <div className="flex items-center">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Loading...
                      </div>
                    ) : (
                      stats.totalUsers.toLocaleString()
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">Registered customers</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {statsLoading ? (
                      <div className="flex items-center">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Loading...
                      </div>
                    ) : (
                      formatCurrency(stats.totalRevenue)
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">Total revenue from orders</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Orders</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {statsLoading ? (
                      <div className="flex items-center">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Loading...
                      </div>
                    ) : (
                      stats.totalOrders.toLocaleString()
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">Total processed orders</p>
                </CardContent>
              </Card>
            </div>

            {/* Admin Tabs */}
            <Tabs defaultValue="products" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="bulk">Bulk Upload</TabsTrigger>
              </TabsList>

              <TabsContent value="products">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Management</CardTitle>
                    <CardDescription>
                      Add, edit, and manage your sneaker inventory
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <p className="text-muted-foreground">
                        {productsLoading ? 'Loading products...' : `${products.length} products in catalog`}
                      </p>
                      <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add New Product
                      </Button>
                    </div>

                    {productsLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span className="ml-2">Loading products...</span>
                      </div>
                    ) : products.length > 0 ? (
                      <div className="border rounded-lg">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Product</TableHead>
                              <TableHead>Brand</TableHead>
                              <TableHead>Price</TableHead>
                              <TableHead>Stock</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {products.slice(0, 10).map((product) => (
                              <TableRow key={product.id}>
                                <TableCell>
                                  <div className="flex items-center gap-3">
                                    <img 
                                      src={product.image_url} 
                                      alt={product.name}
                                      className="w-10 h-10 object-cover rounded-lg bg-muted"
                                      onError={(e) => {
                                        e.currentTarget.src = '/placeholder.svg';
                                      }}
                                    />
                                    <div>
                                      <p className="font-medium">{product.name}</p>
                                      <p className="text-sm text-muted-foreground">{product.category}</p>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="font-medium">{product.brand}</TableCell>
                                <TableCell>{formatCurrency(product.price)}</TableCell>
                                <TableCell>
                                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                    product.stock_quantity > 10
                                      ? 'bg-green-100 text-green-700'
                                      : product.stock_quantity > 0
                                      ? 'bg-yellow-100 text-yellow-700'
                                      : 'bg-red-100 text-red-700'
                                  }`}>
                                    {product.stock_quantity} units
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                    product.in_stock 
                                      ? 'bg-green-100 text-green-700' 
                                      : 'bg-red-100 text-red-700'
                                  }`}>
                                    {product.in_stock ? 'In Stock' : 'Out of Stock'}
                                  </span>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex items-center gap-2 justify-end">
                                    <Button variant="ghost" size="sm" className="gap-1">
                                      <Pencil className="h-3 w-3" />
                                      Edit
                                    </Button>
                                    <Button variant="ghost" size="sm" className="gap-1 text-destructive hover:text-destructive">
                                      <Trash2 className="h-3 w-3" />
                                      Delete
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="border rounded-lg p-8 text-center text-muted-foreground">
                        <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-semibold mb-2">No Products Found</h3>
                        <p className="mb-4">Start by adding your first product to the catalog.</p>
                        <Button className="gap-2">
                          <Plus className="h-4 w-4" />
                          Add Your First Product
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="users">
                <Card>
                  <CardHeader>
                    <CardTitle>User Administration</CardTitle>
                    <CardDescription>
                      Manage user accounts and permissions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <p className="text-muted-foreground">
                        {usersLoading ? 'Loading users...' : `${users.length} registered users`}
                      </p>
                      <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add New User
                      </Button>
                    </div>

                    {usersLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span className="ml-2">Loading users...</span>
                      </div>
                    ) : users.length > 0 ? (
                      <div className="border rounded-lg">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>User</TableHead>
                              <TableHead>Role</TableHead>
                              <TableHead>Joined</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {users.slice(0, 10).map((user) => (
                              <TableRow key={user.id}>
                                <TableCell>
                                  <div>
                                    <p className="font-medium">
                                      {user.display_name || `${user.first_name} ${user.last_name}`.trim() || 'Unnamed User'}
                                    </p>
                                    <p className="text-sm text-muted-foreground">{user.id}</p>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700">
                                    {user.user_roles?.[0]?.role || 'customer'}
                                  </span>
                                </TableCell>
                                <TableCell>{formatDate(user.created_at)}</TableCell>
                                <TableCell className="text-right">
                                  <div className="flex items-center gap-2 justify-end">
                                    <Button variant="ghost" size="sm" className="gap-1">
                                      <Pencil className="h-3 w-3" />
                                      Edit
                                    </Button>
                                    <Button variant="ghost" size="sm" className="gap-1 text-destructive hover:text-destructive">
                                      <Trash2 className="h-3 w-3" />
                                      Remove
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="border rounded-lg p-8 text-center text-muted-foreground">
                        <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-semibold mb-2">No Users Found</h3>
                        <p className="mb-4">No users have registered yet.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="orders">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Management</CardTitle>
                    <CardDescription>
                      View and process customer orders
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <p className="text-muted-foreground">Track and manage all orders</p>
                      <Button variant="outline">Export Orders</Button>
                    </div>
                    <div className="border rounded-lg p-8 text-center text-muted-foreground">
                      <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">Order Management</h3>
                      <p className="mb-4">Order management interface will be implemented here.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="bulk">
                <CSVUpload />
              </TabsContent>
            </Tabs>
          </div>
        </main>
        <Footer />
      </div>
    </AdminProtectedRoute>
  );
};

export default Admin;