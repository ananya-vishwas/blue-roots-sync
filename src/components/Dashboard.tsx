import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Camera, 
  MapPin, 
  TreePine, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  Leaf,
  Users,
  Building,
  Menu,
  Bell
} from "lucide-react";

interface DashboardProps {
  userType: string;
  phoneNumber: string;
  onCapture: () => void;
  onLogout: () => void;
  onAddHistoryEntry?: (entry: { plantName: string; location: string }) => void;
  historyEntries?: Array<{ plantName: string; location: string }>;
}

const Dashboard = ({ userType, phoneNumber, onCapture, onLogout, onAddHistoryEntry, historyEntries: externalHistoryEntries }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [historyEntries, setHistoryEntries] = useState([
    {
      id: 1,
      plantName: "Rhizophora mucronata",
      timestamp: "Today, 2:30 PM",
      status: "pending",
      location: "Mangrove Area A1"
    },
    {
      id: 2,
      plantName: "Avicennia marina", 
      timestamp: "Yesterday, 4:15 PM",
      status: "pending",
      location: "Coastal Strip B2"
    }
  ]);

  // Convert external history entries to internal format
  useEffect(() => {
    if (externalHistoryEntries && externalHistoryEntries.length > 0) {
      const convertedEntries = externalHistoryEntries.map((entry, index) => ({
        id: Date.now() - index,
        plantName: entry.plantName,
        timestamp: new Date().toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }),
        status: "pending" as const,
        location: entry.location
      }));
      setHistoryEntries(prev => [...convertedEntries, ...prev]);
    }
  }, [externalHistoryEntries]);

  const userIcons = {
    farmer: Leaf,
    ngo: Users,
    panchayat: Building
  };

  const UserIcon = userIcons[userType as keyof typeof userIcons] || Leaf;

  const recentSubmissions = [
    {
      id: 1,
      location: "Mangrove Area A1",
      species: "Rhizophora mucronata",
      count: 25,
      date: "Today, 2:30 PM",
      status: "approved",
      coordinates: "12.9716° N, 77.5946° E"
    },
    {
      id: 2, 
      location: "Coastal Strip B2",
      species: "Avicennia marina",
      count: 18,
      date: "Yesterday, 4:15 PM", 
      status: "review",
      coordinates: "12.9716° N, 77.5946° E"
    },
    {
      id: 3,
      location: "Restoration Zone C1",
      species: "Bruguiera gymnorrhiza", 
      count: 32,
      date: "2 days ago, 11:00 AM",
      status: "pending",
      coordinates: "12.9716° N, 77.5946° E"
    }
  ];

  const stats = {
    totalPlanted: 2847,
    approved: 2156,
    pending: 432,
    carbonOffset: 15.8 // tons CO2
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-secondary text-secondary-foreground';
      case 'review': return 'bg-primary text-primary-foreground';
      case 'pending': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return CheckCircle;
      case 'review': return Clock;
      case 'pending': return AlertCircle;
      default: return Clock;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-earth">
      {/* Header */}
      <div className="bg-gradient-carbon shadow-soft">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <UserIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-white capitalize">{userType} Dashboard</h1>
                <p className="text-xs text-white/80">{phoneNumber}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg">
          <Button
            variant={activeTab === "overview" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("overview")}
            className="flex-1"
          >
            Overview
          </Button>
          <Button
            variant={activeTab === "history" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("history")}
            className="flex-1"
          >
            History
          </Button>
        </div>

        {activeTab === "overview" && (
          <>
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="shadow-card border-0">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-gradient-forest rounded-lg flex items-center justify-center mx-auto mb-2">
                <TreePine className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-foreground">{stats.totalPlanted.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Trees Planted</div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-0">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-gradient-ocean rounded-lg flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-foreground">{stats.approved.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Approved</div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-0">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mx-auto mb-2">
                <Clock className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold text-foreground">{stats.pending}</div>
              <div className="text-xs text-muted-foreground">Pending</div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-0">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-gradient-carbon rounded-lg flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div className="text-xl font-bold text-foreground">{stats.carbonOffset}t</div>
              <div className="text-xs text-muted-foreground">CO₂ Offset</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Camera className="h-5 w-5 text-primary" />
              <span>Data Capture</span>
            </CardTitle>
            <CardDescription>
              Capture and submit new restoration data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={onCapture}
              variant="carbon" 
              size="lg" 
              className="w-full h-14"
            >
              <Camera className="h-5 w-5 mr-2" />
              Start New Capture
            </Button>
          </CardContent>
        </Card>

        {/* Recent Submissions */}
        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle>Recent Submissions</CardTitle>
            <CardDescription>Your latest restoration data entries</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentSubmissions.map((submission) => {
              const StatusIcon = getStatusIcon(submission.status);
              return (
                <div 
                  key={submission.id}
                  className="flex items-start space-x-4 p-4 rounded-lg border border-border hover:shadow-soft transition-shadow"
                >
                  <div className="w-12 h-12 bg-gradient-forest rounded-lg flex items-center justify-center flex-shrink-0">
                    <TreePine className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-foreground">{submission.location}</h4>
                      <Badge className={getStatusColor(submission.status)}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {submission.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground mb-1">
                      <span className="font-medium">{submission.species}</span> • {submission.count} plants
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground space-x-4">
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {submission.date}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {submission.coordinates}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Progress Tracking */}
        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle>Monthly Progress</CardTitle>
            <CardDescription>Your contribution this month</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Monthly Target: 500 plants</span>
                <span className="font-medium">340 planted</span>
              </div>
              <Progress value={68} className="h-2" />
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">68%</div>
                <div className="text-xs text-muted-foreground">Target Complete</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">160</div>
                <div className="text-xs text-muted-foreground">Plants Remaining</div>
              </div>
            </div>
          </CardContent>
        </Card>
          </>
        )}

        {activeTab === "history" && (
          <Card className="shadow-card border-0">
            <CardHeader>
              <CardTitle>Capture History</CardTitle>
              <CardDescription>All your data capture submissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {historyEntries.map((entry) => (
                <div 
                  key={entry.id}
                  className="flex items-start space-x-4 p-4 rounded-lg border border-border hover:shadow-soft transition-shadow"
                >
                  <div className="w-12 h-12 bg-gradient-forest rounded-lg flex items-center justify-center flex-shrink-0">
                    <TreePine className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-foreground">{entry.plantName}</h4>
                      <Badge className="bg-muted text-muted-foreground">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {entry.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{entry.location}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {entry.timestamp}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;