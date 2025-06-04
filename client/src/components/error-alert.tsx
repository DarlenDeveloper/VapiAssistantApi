import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X } from "lucide-react";

interface ErrorAlertProps {
  message: string;
  onRetry: () => void;
  onClose: () => void;
}

export default function ErrorAlert({ message, onRetry, onClose }: ErrorAlertProps) {
  return (
    <Alert className="mb-4 border-red-200 bg-red-50">
      <AlertTriangle className="h-4 w-4 text-red-500" />
      <div className="flex-1">
        <h3 className="text-sm font-medium text-red-800">Connection Error</h3>
        <AlertDescription className="text-sm text-red-700 mt-1">
          {message}
        </AlertDescription>
        <Button
          onClick={onRetry}
          variant="link"
          className="mt-2 h-auto p-0 text-sm text-red-800 underline hover:text-red-900"
        >
          Try Again
        </Button>
      </div>
      <Button
        onClick={onClose}
        variant="ghost"
        size="icon"
        className="h-6 w-6 text-red-500 hover:text-red-700"
      >
        <X className="h-4 w-4" />
      </Button>
    </Alert>
  );
}
