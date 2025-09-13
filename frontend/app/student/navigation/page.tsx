// File: frontend/app/student/navigation/page.tsx

"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { apiService } from "@/app/lib/apiService"; // Correctly imports your specific service
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Camera, MapPin, AlertCircle, Wand2, CheckCircle, Navigation, RefreshCw } from "lucide-react";

// --- Define Types ---
interface NavigationResult {
  current_location: string;
  destination: string;
  confidence: string;
  path: string[];
}

export default function NavigationPage() {
  // --- State Management ---
  const [destinations, setDestinations] = useState<string[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<string>('');
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetchingDestinations, setIsFetchingDestinations] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [result, setResult] = useState<NavigationResult | null>(null);

  // --- Refs for Camera Elements ---
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- Data Fetching (CORRECTED) ---
  useEffect(() => {
    const fetchDestinations = async () => {
      setIsFetchingDestinations(true);
      // Use the new specific function from apiService
      const res = await apiService.getNavigationDestinations(); 
      
      if (res.success && res.data) {
        setDestinations(res.data);
        if (res.data.length > 0) {
          setSelectedDestination(res.data[0]); // Set default destination
        }
      } else {
        setError("Could not load destination list. Please try again later.");
        toast.error(res.message);
      }
      setIsFetchingDestinations(false);
    };
    fetchDestinations();
  }, []);

  // --- Camera Cleanup ---
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // --- Core Functions ---
  const handleStartCamera = async () => {
    setError(null);
    setResult(null);
    setCapturedImage(null);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: "environment" } 
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Camera Error:", err);
        setError("Camera permission was denied. Please allow camera access in your browser settings.");
      }
    } else {
      setError("Your browser does not support camera access.");
    }
  };

  const handleTakePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      
      const dataUrl = canvas.toDataURL('image/jpeg');
      setCapturedImage(dataUrl);

      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    }
  };
  
  const handleRetakePhoto = () => {
    handleStartCamera();
  };

  const dataURLtoBlob = (dataurl: string): Blob => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
  }

  // --- Form Submission (CORRECTED) ---
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!capturedImage || !selectedDestination) {
      setError("A photo and destination are required.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const imageBlob = dataURLtoBlob(capturedImage);
      const formData = new FormData();
      formData.append('file', imageBlob, 'location.jpg');
      formData.append('destination', selectedDestination);

      // Use the new specific function from apiService
      const res = await apiService.findNavigationPath(formData);

      if (res.success && res.data) {
        setResult(res.data);
        toast.success("Route found!");
      } else {
        setError(res.message || "Could not identify your location from the photo.");
        toast.error(res.message || "Identification failed.");
      }
    } catch (err: any) {
      setError("An unexpected error occurred during analysis.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- UI Rendering (WITH VISUAL FIX) ---
  const renderContent = () => {
    if (stream) {
      return (
        <div className="relative aspect-video w-full overflow-hidden rounded-md border">
          <video ref={videoRef} autoPlay playsInline className="h-full w-full object-cover" />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            <Button onClick={handleTakePhoto} size="lg" className="rounded-full h-16 w-16">
              <Camera className="h-8 w-8" />
            </Button>
          </div>
        </div>
      );
    }
    
    if (capturedImage) {
      return (
        // VISUAL FIX IS HERE: Parent is 'relative', Image is 'absolute inset-0'
        <div className="relative aspect-video w-full overflow-hidden rounded-md border bg-muted">
          <img 
            src={capturedImage} 
            alt="Captured location" 
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg min-h-[250px]">
        <Camera className="h-12 w-12 text-muted-foreground mb-4"/>
        <h3 className="font-semibold mb-2">Ready to Navigate</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Allow camera access and point it at your surroundings.
        </p>
        <Button onClick={handleStartCamera}>
          <Wand2 className="mr-2 h-4 w-4"/> Start Camera
        </Button>
      </div>
    );
  };
  
  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-4xl mx-auto">
        <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">AI Indoor Navigation</h1>
            <p className="text-muted-foreground">
                Lost inside the campus? Use your camera to find your way.
            </p>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Step 1: Identify Your Location</CardTitle>
                <CardDescription>
                    {stream && "Point your camera at a recognizable feature."}
                    {capturedImage && "Here is the photo you took. You can retake it or proceed."}
                    {!stream && !capturedImage && "Start your camera to take a photo of your location."}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {renderContent()}
                <canvas ref={canvasRef} className="hidden" />
            </CardContent>
            {capturedImage && (
                <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline" onClick={handleRetakePhoto}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Retake Photo
                    </Button>
                </CardFooter>
            )}
        </Card>

        <form onSubmit={handleSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle>Step 2: Choose Your Destination</CardTitle>
                </CardHeader>
                <CardContent>
                    <Select value={selectedDestination} onValueChange={setSelectedDestination} disabled={isFetchingDestinations || destinations.length === 0}>
                        <SelectTrigger>
                            <SelectValue placeholder={isFetchingDestinations ? "Loading destinations..." : "Select a destination"} />
                        </SelectTrigger>
                        <SelectContent>
                            {destinations.map((dest) => (
                            <SelectItem key={dest} value={dest}>{dest}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isLoading || !capturedImage || !selectedDestination} className="w-full">
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <MapPin className="mr-2 h-4 w-4"/>}
                        {isLoading ? "Analyzing..." : "Find My Way"}
                    </Button>
                </CardFooter>
            </Card>
        </form>

        {error && (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {result && (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-6 w-6 text-green-500"/> Your Route is Ready!
                    </CardTitle>
                    <CardDescription>
                        We're <span className="font-semibold text-primary">{result.confidence}%</span> confident your current location is the <span className="font-semibold text-primary">{result.current_location}</span>.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <h3 className="font-semibold mb-3">Directions to {result.destination}:</h3>
                    <ol className="list-decimal list-inside space-y-2">
                        {result.path.map((step, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <Navigation className="h-4 w-4 mt-1 flex-shrink-0"/>
                                <span>{step}</span>
                            </li>
                        ))}
                    </ol>
                </CardContent>
            </Card>
        )}
    </div>
  );
}