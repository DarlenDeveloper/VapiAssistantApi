import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Mic, X } from "lucide-react";

interface PermissionPromptProps {
  onAllow: () => void;
  onClose: () => void;
}

export default function PermissionPrompt({ onAllow, onClose }: PermissionPromptProps) {
  return (
    <Alert className="mb-4 border-amber-200 bg-amber-50">
      <Mic className="h-4 w-4 text-amber-500" />
      <div className="flex-1">
        <h3 className="text-sm font-medium text-amber-800">Microphone Access Required</h3>
        <AlertDescription className="text-sm text-amber-700 mt-1">
          Please allow microphone access to use the voice assistant.
        </AlertDescription>
        <Button
          onClick={onAllow}
          className="mt-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-1 rounded text-sm h-auto"
        >
          Allow Access
        </Button>
      </div>
      <Button
        onClick={onClose}
        variant="ghost"
        size="icon"
        className="h-6 w-6 text-amber-500 hover:text-amber-700"
      >
        <X className="h-4 w-4" />
      </Button>
    </Alert>
  );
}
