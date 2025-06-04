import { Card } from "@/components/ui/card";
import { Mic, MicOff, Volume2 } from "lucide-react";
import type { CallState } from "@/hooks/use-vapi";

interface CallStatusProps {
  callState: CallState;
  callDuration: number;
  isMuted: boolean;
}

export default function CallStatus({ callState, callDuration, isMuted }: CallStatusProps) {
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getStatusDisplay = () => {
    switch (callState) {
      case 'connected':
        return {
          dot: 'bg-green-500 animate-pulse-slow',
          text: 'Connected'
        };
      case 'connecting':
        return {
          dot: 'bg-yellow-500 animate-pulse',
          text: 'Connecting'
        };
      case 'error':
        return {
          dot: 'bg-red-500',
          text: 'Connection Failed'
        };
      default:
        return {
          dot: 'bg-gray-400',
          text: 'Disconnected'
        };
    }
  };

  const status = getStatusDisplay();

  return (
    <Card className="p-6 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">Call Status</h2>
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${status.dot}`} />
          <span className="text-sm text-gray-600">{status.text}</span>
        </div>
      </div>

      {/* Call Duration */}
      <div className="flex items-center justify-between py-2 border-b border-gray-100">
        <span className="text-sm text-gray-600">Duration</span>
        <span className="text-sm font-medium text-gray-900">
          {formatDuration(callDuration)}
        </span>
      </div>

      {/* Audio Status */}
      <div className="flex items-center justify-between py-2">
        <span className="text-sm text-gray-600">Audio</span>
        <div className="flex items-center">
          {isMuted ? (
            <MicOff className="w-4 h-4 text-red-500 mr-2" />
          ) : (
            <Mic className="w-4 h-4 text-green-500 mr-2" />
          )}
          <Volume2 className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </Card>
  );
}
