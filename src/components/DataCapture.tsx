import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Camera, 
  MapPin, 
  Upload, 
  ArrowLeft, 
  Check,
  Clock,
  TreePine,
  Wifi,
  WifiOff
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DataCaptureProps {
  onBack: () => void;
  userType: string;
  onSubmissionComplete?: (data: { plantName: string; location: string }) => void;
}

const DataCapture = ({ onBack, userType, onSubmissionComplete }: DataCaptureProps) => {
  const [capturedImage, setCapturedImage] = useState<string>("");
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [submissionStatus, setSubmissionStatus] = useState<"idle" | "uploading" | "queued" | "submitted">("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    contributorName: "",
    plantSpecies: "",
    plantCount: "",
    location: "",
    coordinates: "",
    notes: ""
  });

  const plantSpecies = [
    "Rhizophora mucronata (Red Mangrove)",
    "Avicennia marina (White Mangrove)", 
    "Bruguiera gymnorrhiza (Black Mangrove)",
    "Sonneratia alba (Mangrove Apple)",
    "Xylocarpus granatum (Cannonball Mangrove)",
    "Heritiera littoralis (Looking Glass Tree)",
    "Other (specify in notes)"
  ];

  // Simulate GPS coordinates
  const getCurrentLocation = () => {
    const lat = (Math.random() * (13.1 - 12.9) + 12.9).toFixed(6);
    const lng = (Math.random() * (77.7 - 77.5) + 77.5).toFixed(6);
    setFormData(prev => ({
      ...prev,
      coordinates: `${lat}° N, ${lng}° E`
    }));
    toast({
      title: "Location captured",
      description: "GPS coordinates have been recorded"
    });
  };

  // Simulate camera capture
  const handleCameraCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCapturedImage(e.target?.result as string);
        getCurrentLocation(); // Auto-capture GPS when image is taken
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!capturedImage || !formData.contributorName || !formData.plantSpecies || !formData.plantCount) {
      toast({
        title: "Missing Information",
        description: "Please complete all required fields",
        variant: "destructive"
      });
      return;
    }

    setSubmissionStatus("uploading");

    // Simulate submission
    setTimeout(() => {
      if (isOnline) {
        setSubmissionStatus("submitted");
        toast({
          title: "Submission Complete",
          description: "Your restoration data has been submitted for review"
        });
      } else {
        setSubmissionStatus("queued");
        toast({
          title: "Queued for Upload", 
          description: "Will sync when internet connection is restored"
        });
      }
      
      // Add to history
      if (onSubmissionComplete) {
        onSubmissionComplete({
          plantName: formData.plantSpecies,
          location: formData.location || "Location not specified"
        });
      }
    }, 2000);
  };

  const resetForm = () => {
    setCapturedImage("");
    setFormData({
      contributorName: "",
      plantSpecies: "",
      plantCount: "",
      location: "",
      coordinates: "",
      notes: ""
    });
    setSubmissionStatus("idle");
  };

  if (submissionStatus === "submitted" || submissionStatus === "queued") {
    return (
      <div className="min-h-screen bg-gradient-earth">
        <div className="container mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" onClick={onBack} className="p-0">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </Button>
            <Badge variant="secondary" className="flex items-center space-x-1">
              {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
              <span>{isOnline ? "Online" : "Offline"}</span>
            </Badge>
          </div>

          {/* Success Message */}
          <div className="max-w-md mx-auto">
            <Card className="shadow-card border-0 text-center">
              <CardContent className="pt-8 pb-6">
                <div className={`w-16 h-16 ${submissionStatus === 'submitted' ? 'bg-gradient-forest' : 'bg-gradient-ocean'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  {submissionStatus === 'submitted' ? 
                    <Check className="h-8 w-8 text-white" /> : 
                    <Clock className="h-8 w-8 text-white" />
                  }
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  {submissionStatus === 'submitted' ? 'Submission Complete!' : 'Queued for Upload'}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {submissionStatus === 'submitted' 
                    ? 'Your restoration data has been submitted and will be reviewed within 24-48 hours.'
                    : 'Your data is safely stored locally and will upload automatically when you\'re back online.'
                  }
                </p>
                <div className="space-y-3">
                  <Button onClick={resetForm} variant="carbon" className="w-full">
                    Submit Another Entry
                  </Button>
                  <Button onClick={onBack} variant="outline" className="w-full">
                    Return to Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-earth">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={onBack} className="p-0">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Button>
          <Badge variant="secondary" className="flex items-center space-x-1">
            {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
            <span>{isOnline ? "Online" : "Offline"}</span>
          </Badge>
        </div>

        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TreePine className="h-5 w-5 text-primary" />
              <span>Restoration Data Capture</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Image Capture */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Plant Photo *</Label>
              {!capturedImage ? (
                <div 
                  onClick={handleCameraCapture}
                  className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                >
                  <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-foreground font-medium mb-1">Tap to capture photo</p>
                  <p className="text-sm text-muted-foreground">GPS coordinates will be auto-captured</p>
                </div>
              ) : (
                <div className="relative">
                  <img 
                    src={capturedImage} 
                    alt="Captured plant"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <div className="absolute top-2 right-2 space-x-2">
                    <Badge className="bg-black/70 text-white">
                      <MapPin className="h-3 w-3 mr-1" />
                      GPS Tagged
                    </Badge>
                  </div>
                  <Button
                    onClick={() => setCapturedImage("")}
                    variant="secondary"
                    size="sm"
                    className="absolute bottom-2 right-2"
                  >
                    Retake
                  </Button>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* Form Fields */}
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="contributor">Contributor Name *</Label>
                <Input
                  id="contributor"
                  value={formData.contributorName}
                  onChange={(e) => setFormData(prev => ({ ...prev, contributorName: e.target.value }))}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="species">Plant Species *</Label>
                <Select 
                  value={formData.plantSpecies} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, plantSpecies: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select plant species" />
                  </SelectTrigger>
                  <SelectContent>
                    {plantSpecies.map((species) => (
                      <SelectItem key={species} value={species}>
                        {species}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="count">Number of Plants *</Label>
                  <Input
                    id="count"
                    type="number"
                    value={formData.plantCount}
                    onChange={(e) => setFormData(prev => ({ ...prev, plantCount: e.target.value }))}
                    placeholder="e.g. 25"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location Name</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g. Mangrove Area A1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="coordinates">GPS Coordinates</Label>
                <div className="flex space-x-2">
                  <Input
                    id="coordinates"
                    value={formData.coordinates}
                    readOnly
                    placeholder="Will be auto-captured"
                    className="bg-muted"
                  />
                  <Button onClick={getCurrentLocation} variant="outline" size="icon">
                    <MapPin className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Any additional observations about soil, weather, growth conditions..."
                  rows={3}
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={submissionStatus === "uploading"}
              variant="carbon"
              size="lg"
              className="w-full h-12"
            >
              {submissionStatus === "uploading" ? (
                <>
                  <Upload className="h-4 w-4 mr-2 animate-pulse" />
                  Submitting Data...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Submit Restoration Data
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DataCapture;