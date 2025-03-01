import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  PawPrint,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Clock,
} from "lucide-react";

const Dashboard = () => {
  // Mock data for dashboard
  const stats = [
    {
      title: "Total Users",
      value: "2,845",
      change: "+12%",
      trend: "up",
      icon: <Users className="h-5 w-5" />,
      color: "bg-blue-500",
    },
    {
      title: "Total Pets",
      value: "1,257",
      change: "+8%",
      trend: "up",
      icon: <PawPrint className="h-5 w-5" />,
      color: "bg-green-500",
    },
    {
      title: "Active Reports",
      value: "342",
      change: "-5%",
      trend: "down",
      icon: <AlertTriangle className="h-5 w-5" />,
      color: "bg-yellow-500",
    },
    {
      title: "Successful Matches",
      value: "128",
      change: "+24%",
      trend: "up",
      icon: <CheckCircle className="h-5 w-5" />,
      color: "bg-purple-500",
    },
  ];

  const recentActivity = [
    {
      id: 1,
      action: "New user registered",
      user: "John Smith",
      time: "5 minutes ago",
    },
    {
      id: 2,
      action: "Pet report created",
      user: "Sarah Johnson",
      time: "15 minutes ago",
    },
    {
      id: 3,
      action: "User account blocked",
      user: "Michael Brown",
      time: "1 hour ago",
    },
    {
      id: 4,
      action: "Pet marked as found",
      user: "Emily Davis",
      time: "2 hours ago",
    },
    {
      id: 5,
      action: "New match suggested",
      user: "System",
      time: "3 hours ago",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of the platform activity
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-x-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <div className="flex items-center gap-1">
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <span
                      className={`text-xs font-medium ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}
                    >
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`p-2 rounded-full ${stat.color}`}>
                  <div className="text-white">{stat.icon}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Activity */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.user}
                    </p>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" />
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Platform Health</CardTitle>
            <CardDescription>Current system status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">New Users (24h)</p>
                  <div className="flex items-center">
                    <TrendingUp className="mr-2 h-4 w-4 text-green-500" />
                    <span className="text-2xl font-bold">48</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">New Reports (24h)</p>
                  <div className="flex items-center">
                    <TrendingUp className="mr-2 h-4 w-4 text-green-500" />
                    <span className="text-2xl font-bold">23</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Pending Reviews</p>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-yellow-500" />
                    <span className="text-2xl font-bold">12</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Blocked Accounts</p>
                  <div className="flex items-center">
                    <AlertTriangle className="mr-2 h-4 w-4 text-red-500" />
                    <span className="text-2xl font-bold">7</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
