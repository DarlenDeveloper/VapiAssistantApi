import { useState, useEffect, useCallback, useRef } from 'react';
import { VAPIClient, type CallResult } from '@/lib/vapi-client';

export type CallState = 'disconnected' | 'connecting' | 'connected' | 'error';

interface UseVapiReturn {
  callState: CallState;
  isConnected: boolean;
  isConnecting: boolean;
  isMuted: boolean;
  callDuration: number;
  error: string | null;
  startCall: () => Promise<void>;
  endCall: () => Promise<void>;
  toggleMute: () => void;
  clearError: () => void;
}

export function useVapi(): UseVapiReturn {
  const [callState, setCallState] = useState<CallState>('disconnected');
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const vapiClientRef = useRef<VAPIClient | null>(null);
  const callStartTimeRef = useRef<number | null>(null);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize VAPI client
  useEffect(() => {
    vapiClientRef.current = new VAPIClient();
    
    return () => {
      if (vapiClientRef.current) {
        vapiClientRef.current.removeAllListeners();
      }
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    };
  }, []);

  // Setup VAPI event listeners
  useEffect(() => {
    const vapi = vapiClientRef.current;
    if (!vapi) return;

    const handleCallStart = () => {
      console.log('VAPI: Call started');
      setCallState('connected');
      callStartTimeRef.current = Date.now();
      
      // Start duration timer
      durationIntervalRef.current = setInterval(() => {
        if (callStartTimeRef.current) {
          const elapsed = Math.floor((Date.now() - callStartTimeRef.current) / 1000);
          setCallDuration(elapsed);
        }
      }, 1000);
    };

    const handleCallEnd = () => {
      console.log('VAPI: Call ended');
      setCallState('disconnected');
      callStartTimeRef.current = null;
      setCallDuration(0);
      
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
        durationIntervalRef.current = null;
      }
    };

    vapi.onCallStart(handleCallStart);
    vapi.onCallEnd(handleCallEnd);

    return () => {
      vapi.removeAllListeners();
    };
  }, []);

  const startCall = useCallback(async () => {
    const vapi = vapiClientRef.current;
    if (!vapi || callState === 'connecting' || callState === 'connected') return;

    setCallState('connecting');
    setError(null);

    try {
      const result: CallResult = await vapi.startCall();
      
      if (result.success) {
        setCallState('connected');
        callStartTimeRef.current = Date.now();
        
        // Start duration timer
        durationIntervalRef.current = setInterval(() => {
          if (callStartTimeRef.current) {
            const elapsed = Math.floor((Date.now() - callStartTimeRef.current) / 1000);
            setCallDuration(elapsed);
          }
        }, 1000);
      } else {
        setCallState('error');
        setError(result.error || 'Failed to start call');
      }
    } catch (err: any) {
      setCallState('error');
      setError(err.message || 'Failed to start call');
    }
  }, [callState]);

  const endCall = useCallback(async () => {
    const vapi = vapiClientRef.current;
    if (!vapi || callState !== 'connected') return;

    setCallState('connecting');

    try {
      const result: CallResult = await vapi.endCall();
      
      if (result.success) {
        setCallState('disconnected');
        callStartTimeRef.current = null;
        setCallDuration(0);
        
        if (durationIntervalRef.current) {
          clearInterval(durationIntervalRef.current);
          durationIntervalRef.current = null;
        }
      } else {
        setCallState('error');
        setError(result.error || 'Failed to end call');
      }
    } catch (err: any) {
      setCallState('error');
      setError(err.message || 'Failed to end call');
    }
  }, [callState]);

  const toggleMute = useCallback(() => {
    const vapi = vapiClientRef.current;
    if (!vapi || callState !== 'connected') return;

    const newMutedState = vapi.toggleMute();
    setIsMuted(newMutedState);
  }, [callState]);

  const clearError = useCallback(() => {
    setError(null);
    if (callState === 'error') {
      setCallState('disconnected');
    }
  }, [callState]);

  return {
    callState,
    isConnected: callState === 'connected',
    isConnecting: callState === 'connecting',
    isMuted,
    callDuration,
    error,
    startCall,
    endCall,
    toggleMute,
    clearError
  };
}
