import { useState } from "react";
import { Star, Search, Download, Menu, Users, BarChart3, Calendar, FileText, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { NavLink } from "react-router-dom";

// Mock employee data
const employees = [
  { id: "EMP001", name: "Juan Dela Cruz", department: "Field", position: "Field Worker", rating: 0, notes: "" },
  { id: "EMP002", name: "Maria Santos", department: "Packing", position: "Packing Supervisor", rating: 0, notes: "" },
  { id: "EMP003", name: "Pedro Garcia", department: "Field", position: "Equipment Operator", rating: 0, notes: "" },
  { id: "EMP004", name: "Ana Rodriguez", department: "Packing", position: "Quality Control", rating: 0, notes: "" },
  { id: "EMP005", name: "Luis Fernandez", department: "Field", position: "Field Supervisor", rating: 0, notes: "" },
  { id: "EMP006", name: "Carmen Torres", department: "Packing", position: "Packing Worker", rating: 0, notes: "" },
];

const navigation = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Attendance", url: "/attendance", icon: Calendar },
  { title: "Leave", url: "/leave", icon: FileText },
  { title: "Evaluation", url: "/evaluation", icon: BarChart3 },
  { title: "Reports", url: "/reports", icon: Users },
];

function AppSidebar() {
  return (
    <Sidebar className="border-r border-border">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-hris-green font-bold text-lg">CFARBEMPCO</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                          isActive
                            ? "bg-hris-green text-white"
                            : "text-foreground hover:bg-hris-green-light hover:text-hris-green-dark"
                        }`
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

const StarRating = ({ rating, onRatingChange }: { rating: number; onRatingChange: (rating: number) => void }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-5 w-5 cursor-pointer transition-colors ${
            star <= rating ? "fill-hris-green text-hris-green" : "text-gray-300 hover:text-hris-green"
          }`}
          onClick={() => onRatingChange(star)}
        />
      ))}
    </div>
  );
};

const Evaluation = () => {
  const [employeeData, setEmployeeData] = useState(employees);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEmployees = employeeData.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const updateRating = (id: string, rating: number) => {
    setEmployeeData((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, rating } : emp))
    );
  };

  const updateNotes = (id: string, notes: string) => {
    setEmployeeData((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, notes } : emp))
    );
  };

  const topPerformers = employeeData
    .filter((emp) => emp.rating > 0)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  const fieldAverage = employeeData
    .filter((emp) => emp.department === "Field" && emp.rating > 0)
    .reduce((acc, emp, _, arr) => acc + emp.rating / arr.length, 0);

  const packingAverage = employeeData
    .filter((emp) => emp.department === "Packing" && emp.rating > 0)
    .reduce((acc, emp, _, arr) => acc + emp.rating / arr.length, 0);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="border-b border-border bg-card">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="lg:hidden">
                  <Menu className="h-6 w-6" />
                </SidebarTrigger>
                <div>
                  <h1 className="text-2xl font-bold text-hris-green">Employee Evaluation</h1>
                  <p className="text-muted-foreground">Add Evaluation Rating</p>
                </div>
              </div>
              <Button className="bg-hris-green hover:bg-hris-green-dark text-white">
                <Download className="h-4 w-4 mr-2" />
                Export to PDF
              </Button>
            </div>
          </header>

          <main className="flex-1 p-6 space-y-6">
            {/* Search Bar */}
            <Card>
              <CardContent className="pt-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search employees by name or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Employee Evaluation Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-hris-green">Employee Ratings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredEmployees.map((employee) => (
                    <div
                      key={employee.id}
                      className="grid grid-cols-1 lg:grid-cols-7 gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="lg:col-span-1">
                        <p className="font-medium">{employee.id}</p>
                      </div>
                      <div className="lg:col-span-1">
                        <p className="font-medium">{employee.name}</p>
                      </div>
                      <div className="lg:col-span-1">
                        <Badge variant={employee.department === "Field" ? "default" : "secondary"}>
                          {employee.department}
                        </Badge>
                      </div>
                      <div className="lg:col-span-1">
                        <p className="text-sm text-muted-foreground">{employee.position}</p>
                      </div>
                      <div className="lg:col-span-1">
                        <StarRating
                          rating={employee.rating}
                          onRatingChange={(rating) => updateRating(employee.id, rating)}
                        />
                      </div>
                      <div className="lg:col-span-1">
                        <Textarea
                          placeholder="Notes..."
                          value={employee.notes}
                          onChange={(e) => updateNotes(employee.id, e.target.value)}
                          className="min-h-[60px] resize-none"
                        />
                      </div>
                      <div className="lg:col-span-1">
                        <Button 
                          size="sm" 
                          className="w-full bg-hris-green hover:bg-hris-green-dark text-white"
                          disabled={employee.rating === 0}
                        >
                          Submit Rating
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Summary Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Performers */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-hris-green flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Top Performers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topPerformers.length > 0 ? (
                      topPerformers.map((employee, index) => (
                        <div key={employee.id} className="flex items-center justify-between p-3 bg-hris-green-light rounded-lg">
                          <div>
                            <p className="font-medium">{employee.name}</p>
                            <p className="text-sm text-muted-foreground">{employee.department} - {employee.position}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {Array.from({ length: employee.rating }).map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-hris-green text-hris-green" />
                              ))}
                            </div>
                            <Badge className="bg-hris-green text-white">#{index + 1}</Badge>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-center py-4">No ratings submitted yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Department Averages */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-hris-green flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Department Averages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Field Department</p>
                        <p className="text-sm text-muted-foreground">
                          {employeeData.filter(emp => emp.department === "Field").length} employees
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-hris-green">
                          {fieldAverage > 0 ? fieldAverage.toFixed(1) : "-"}
                        </p>
                        <div className="flex">
                          {fieldAverage > 0 && Array.from({ length: Math.round(fieldAverage) }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-hris-green text-hris-green" />
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Packing Department</p>
                        <p className="text-sm text-muted-foreground">
                          {employeeData.filter(emp => emp.department === "Packing").length} employees
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-hris-green">
                          {packingAverage > 0 ? packingAverage.toFixed(1) : "-"}
                        </p>
                        <div className="flex">
                          {packingAverage > 0 && Array.from({ length: Math.round(packingAverage) }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-hris-green text-hris-green" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Evaluation;