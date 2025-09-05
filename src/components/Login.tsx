import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Leaf, Users, Building } from "lucide-react";
import heroImage from "@/assets/hero-blue-carbon.jpg";

interface LoginProps {
  onLogin: (userType: string, phone: string) => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const userRoles = [
    {
      id: "farmer",
      title: "Farmer",
      description: "Plant and monitor restoration areas",
      icon: Leaf,
      color: "bg-gradient-forest"
    },
    {
      id: "ngo", 
      title: "NGO",
      description: "Coordinate restoration projects",
      icon: Users,
      color: "bg-gradient-ocean"
    },
    {
      id: "panchayat",
      title: "Coastal Panchayat", 
      description: "Manage community initiatives",
      icon: Building,
      color: "bg-gradient-carbon"
    }
  ];

  const handleSendOTP = () => {
    if (phoneNumber && selectedRole) {
      setOtpSent(true);
      // Simulate OTP sending
    }
  };

  const handleVerifyOTP = () => {
    if (otp.length === 6) {
      onLogin(selectedRole, phoneNumber);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-earth">
      {/* Hero Section */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={heroImage} 
          alt="Blue Carbon Coastal Restoration"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/60 to-primary/80" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-3xl font-bold mb-2">Blue Carbon Registry</h1>
            <p className="text-lg opacity-90">Restoring Our Coastal Ecosystems</p>
          </div>
        </div>
      </div>

      {/* Login Content */}
      <div className="container mx-auto px-4 py-8 max-w-md">
        <Card className="shadow-card border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-foreground">Welcome Back</CardTitle>
            <CardDescription>
              Join the movement for coastal restoration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!otpSent ? (
              <>
                {/* Role Selection */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">Select Your Role</label>
                  <div className="grid gap-3">
                    {userRoles.map((role) => {
                      const IconComponent = role.icon;
                      return (
                        <div
                          key={role.id}
                          onClick={() => setSelectedRole(role.id)}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                            selectedRole === role.id 
                              ? 'border-primary shadow-glow' 
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${role.color}`}>
                              <IconComponent className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-foreground">{role.title}</div>
                              <div className="text-sm text-muted-foreground">{role.description}</div>
                            </div>
                            {selectedRole === role.id && (
                              <Badge variant="secondary" className="bg-primary text-primary-foreground">
                                Selected
                              </Badge>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Phone Number</label>
                  <Input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="h-12"
                  />
                </div>

                <Button 
                  onClick={handleSendOTP}
                  disabled={!selectedRole || !phoneNumber}
                  variant="carbon"
                  size="lg"
                  className="w-full h-12"
                >
                  Send OTP
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                {/* OTP Verification */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-ocean rounded-full flex items-center justify-center mx-auto mb-4">
                    <ArrowRight className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">Verify OTP</h3>
                  <p className="text-muted-foreground text-sm">
                    Enter the 6-digit code sent to <br />
                    <span className="font-medium">{phoneNumber}</span>
                  </p>
                </div>

                <div className="space-y-4">
                  <Input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="h-12 text-center text-lg tracking-widest"
                    maxLength={6}
                  />
                  
                  <Button 
                    onClick={handleVerifyOTP}
                    disabled={otp.length !== 6}
                    variant="carbon"
                    size="lg"
                    className="w-full h-12"
                  >
                    Verify & Continue
                  </Button>

                  <Button 
                    onClick={() => setOtpSent(false)}
                    variant="ghost"
                    className="w-full"
                  >
                    Back to Phone Number
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;