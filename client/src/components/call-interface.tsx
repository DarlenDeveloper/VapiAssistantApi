import { Button } from "@/components/ui/button";
import { Mic, MicOff, Loader2 } from "lucide-react";
import ErrorAlert from "./error-alert";
import PermissionPrompt from "./permission-prompt";
import { useVapi } from "@/hooks/use-vapi";
import { useState } from "react";

export default function CallInterface() {
  const vapi = useVapi();
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCallToggle = async () => {
    if (vapi.isConnected) {
      setIsLoading(true);
      await vapi.endCall();
      setIsLoading(false);
    } else {
      setIsLoading(true);
      
      try {
        // Check microphone permission first
        await navigator.mediaDevices.getUserMedia({ audio: true });
        await vapi.startCall();
      } catch (error: any) {
        if (error.name === 'NotAllowedError' || error.message.includes('Permission denied')) {
          setShowPermissionPrompt(true);
        }
      }
      
      setIsLoading(false);
    }
  };

  const handleRetryPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setShowPermissionPrompt(false);
      setIsLoading(true);
      await vapi.startCall();
      setIsLoading(false);
    } catch (error) {
      // Keep permission prompt open if still denied
    }
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getStatusText = () => {
    if (vapi.isConnected) return `Connected • ${formatDuration(vapi.callDuration)}`;
    if (vapi.isConnecting || isLoading) return "Connecting...";
    return "Click to talk";
  };

  const getButtonIcon = () => {
    if (isLoading || vapi.isConnecting) {
      return <Loader2 className="w-6 h-6 animate-spin" />;
    }
    if (vapi.isMuted) {
      return <MicOff className="w-6 h-6" />;
    }
    return <Mic className="w-6 h-6" />;
  };

  const getButtonClass = () => {
    if (vapi.isConnected) {
      return vapi.isMuted 
        ? "w-16 h-16 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all duration-200"
        : "w-16 h-16 bg-primary hover:bg-primary/90 text-white rounded-full shadow-lg transition-all duration-200";
    }
    return "w-16 h-16 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full shadow-lg transition-all duration-200";
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Main Voice Button */}
      <div className="flex flex-col items-center space-y-4">
        <Button
          onClick={vapi.isConnected ? vapi.toggleMute : handleCallToggle}
          disabled={isLoading || vapi.isConnecting}
          className={getButtonClass()}
        >
          {getButtonIcon()}
        </Button>
        
        {/* Status Text */}
        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
          {getStatusText()}
        </p>
      </div>

      {/* End Call Button (only show when connected) */}
      {vapi.isConnected && (
        <Button
          onClick={handleCallToggle}
          variant="outline"
          className="text-red-600 border-red-600 hover:bg-red-50 hover:border-red-700"
        >
          End Call
        </Button>
      )}

      {/* Error Alert */}
      {vapi.error && (
        <div className="w-full max-w-sm">
          <ErrorAlert
            message={vapi.error}
            onRetry={handleCallToggle}
            onClose={vapi.clearError}
          />
        </div>
      )}

      {/* Permission Prompt */}
      {showPermissionPrompt && (
        <div className="w-full max-w-sm">
          <PermissionPrompt
            onAllow={handleRetryPermission}
            onClose={() => setShowPermissionPrompt(false)}
          />
        </div>
      )}
    </div>
  );
}
