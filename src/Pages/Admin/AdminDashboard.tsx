import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

import { Plus } from "lucide-react";
import { Card, CardContent } from "../../Components/ui/card";
import { Button } from "../../Components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableRow } from "../../Components/ui/table";
import { Input } from "../../Components/ui/input";
import Navbar from "../../Components/Navbar/Navbar";
import { useAuth } from "../../Route/Route";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {

  const { cartCount, darkMode, setDarkMode } = useAuth();

  // Sample data for charts
  const salesData = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Monthly Sales ($)",
        data: [12000, 15000, 18000, 20000, 24000, 22000],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const users = [
    { id: 1, name: "Jane Doe", role: "Seller", email: "jane@example.com" },
    { id: 2, name: "John Smith", role: "Buyer", email: "john@example.com" },
    { id: 3, name: "Alice Johnson", role: "Seller", email: "alice@example.com" },
  ];

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar
        toggleDarkMode={() => setDarkMode(!darkMode)}
        darkMode={darkMode}
        cartCount={cartCount}
      />
      <h1 className="text-2xl font-bold mb-6 mt-24">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold">Total Sales</h2>
            <p className="text-2xl font-bold">$120,000</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold">Total Users</h2>
            <p className="text-2xl font-bold">1,234</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold">Total Products</h2>
            <p className="text-2xl font-bold">567</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold">Pending Orders</h2>
            <p className="text-2xl font-bold">42</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-bold mb-4">Sales Overview</h2>
        <Bar data={salesData} />
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Users</h2>
          <Button><Plus className="mr-2" /> Add User</Button>
        </div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-bold mb-4">Search</h2>
        <Input type="text" placeholder="Search for a user or product..." />
      </div>
    </div>
  );
};

export default AdminDashboard;