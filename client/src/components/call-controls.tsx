import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, PhoneOff, MicOff, Mic, Volume2, Loader2 } from "lucide-react";

interface CallControlsProps {
  isConnected: boolean;
  isConnecting: boolean;
  isMuted: boolean;
  isLoading: boolean;
  loadingMessage: string;
  onCallToggle: () => void;
  onMuteToggle: () => void;
}

export default function CallControls({
  isConnected,
  isConnecting,
  isMuted,
  isLoading,
  loadingMessage,
  onCallToggle,
  onMuteToggle
}: CallControlsProps) {
  const getCallButtonProps = () => {
    if (isLoading || isConnecting) {
      return {
        className: "w-20 h-20 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full shadow-lg transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-300 mx-auto flex items-center justify-center group",
        icon: <Loader2 className="w-8 h-8 animate-spin" />,
        text: isLoading ? "Connecting..." : "Connecting..."
      };
    } else if (isConnected) {
      return {
        className: "w-20 h-20 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300 mx-auto flex items-center justify-center group",
        icon: <PhoneOff className="w-8 h-8 group-hover:scale-110 transition-transform duration-200" />,
        text: "End Call"
      };
    } else {
      return {
        className: "w-20 h-20 bg-primary hover:bg-primary/90 text-white rounded-full shadow-lg transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 mx-auto flex items-center justify-center group",
        icon: <Phone className="w-8 h-8 group-hover:scale-110 transition-transform duration-200" />,
        text: "Tap to Start Call"
      };
    }
  };

  const callButtonProps = getCallButtonProps();

  return (
    <>
      <Card className="p-8 mb-4">
        {/* Primary Call Button */}
        <div className="text-center mb-6">
          <Button
            onClick={onCallToggle}
            disabled={isLoading || isConnecting}
            className={callButtonProps.className}
          >
            {callButtonProps.icon}
          </Button>
          <p className="text-sm text-gray-600 mt-3">
            {callButtonProps.text}
          </p>
        </div>

        {/* Secondary Controls */}
        <div className="flex justify-center space-x-4">
          {/* Mute Button */}
          <Button
            onClick={onMuteToggle}
            disabled={!isConnected}
            variant="outline"
            size="icon"
            className="w-12 h-12 rounded-full"
          >
            {isMuted ? (
              <MicOff className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </Button>

          {/* Volume Button */}
          <Button
            disabled={!isConnected}
            variant="outline"
            size="icon"
            className="w-12 h-12 rounded-full"
          >
            <Volume2 className="w-5 h-5" />
          </Button>
        </div>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <Card className="p-6 mb-4 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">{loadingMessage}</p>
        </Card>
      )}
    </>
  );
}
