import { useState } from "react";
import { Star, Search, Download, Menu, Users, BarChart3, Calendar, FileText, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { EvaluationModal } from "@/components/evaluation/EvaluationModal";

// Mock employee data
const employees = [
  { id: "EMP001", name: "Juan Dela Cruz", department: "Field", position: "Field Worker", rating: 0, notes: "", criteriaRatings: {} },
  { id: "EMP002", name: "Maria Santos", department: "Packing", position: "Packing Supervisor", rating: 0, notes: "", criteriaRatings: {} },
  { id: "EMP003", name: "Pedro Garcia", department: "Field", position: "Equipment Operator", rating: 0, notes: "", criteriaRatings: {} },
  { id: "EMP004", name: "Ana Rodriguez", department: "Packing", position: "Quality Control", rating: 0, notes: "", criteriaRatings: {} },
  { id: "EMP005", name: "Luis Fernandez", department: "Field", position: "Field Supervisor", rating: 0, notes: "", criteriaRatings: {} },
  { id: "EMP006", name: "Carmen Torres", department: "Packing", position: "Packing Worker", rating: 0, notes: "", criteriaRatings: {} },
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

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating ? "fill-hris-green text-hris-green" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

const Evaluation = () => {
  const [employeeData, setEmployeeData] = useState(employees);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<typeof employees[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [departmentFilter, setDepartmentFilter] = useState<string>("All");

  const filteredEmployees = employeeData.filter(
    (employee) => {
      const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = departmentFilter === "All" || employee.department === departmentFilter;
      return matchesSearch && matchesDepartment;
    }
  );

  const handleEmployeeClick = (employee: typeof employees[0]) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleSaveEvaluation = (employeeId: string, criteriaRatings: Record<string, number>, notes: string, averageRating: number) => {
    setEmployeeData((prev) =>
      prev.map((emp) => 
        emp.id === employeeId 
          ? { ...emp, criteriaRatings, notes, rating: averageRating }
          : emp
      )
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
            {/* Search and Filter Bar */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search employees by name or ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-2">
                    {["All", "Field", "Packing"].map((dept) => (
                      <Button
                        key={dept}
                        variant={departmentFilter === dept ? "default" : "outline"}
                        size="sm"
                        onClick={() => setDepartmentFilter(dept)}
                        className={
                          departmentFilter === dept 
                            ? "bg-hris-green hover:bg-hris-green-dark text-white" 
                            : ""
                        }
                      >
                        {dept}
                      </Button>
                    ))}
                  </div>
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
                      className="grid grid-cols-1 lg:grid-cols-6 gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => handleEmployeeClick(employee)}
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
                        <StarRating rating={employee.rating} />
                        {employee.rating > 0 && (
                          <p className="text-sm text-hris-green font-medium mt-1">
                            {employee.rating.toFixed(1)}
                          </p>
                        )}
                      </div>
                      <div className="lg:col-span-1">
                        <Button 
                          size="sm" 
                          className="w-full bg-hris-green hover:bg-hris-green-dark text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEmployeeClick(employee);
                          }}
                        >
                          {employee.rating > 0 ? "Edit Rating" : "Add Rating"}
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

        <EvaluationModal
          employee={selectedEmployee}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveEvaluation}
        />
      </div>
    </SidebarProvider>
  );
};

export default Evaluation;