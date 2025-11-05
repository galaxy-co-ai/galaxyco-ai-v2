/**
 * Voice Input Component
 *
 * Allows users to talk to the AI assistant using their microphone.
 * Features:
 * - Browser SpeechRecognition API
 * - Visual feedback during recording
 * - Automatic transcription
 * - Hands-free operation
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export interface VoiceInputProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

export function VoiceInput({ onTranscript, disabled }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check if browser supports speech recognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        setIsSupported(true);

        // Initialize recognition
        const recognition = new SpeechRecognition();
        recognition.continuous = false; // Stop after one phrase
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          onTranscript(transcript);
          setIsListening(false);
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);

          if (event.error === 'not-allowed') {
            toast.error('Microphone access denied. Please enable in browser settings.');
          } else {
            toast.error('Voice recognition failed. Please try again.');
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onTranscript]);

  const startListening = () => {
    if (!recognitionRef.current) return;

    try {
      recognitionRef.current.start();
      setIsListening(true);
      toast.info('Listening... Speak now');
    } catch (error) {
      console.error('Failed to start recognition:', error);
      toast.error('Failed to start voice input');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  if (!isSupported) {
    return null; // Hide if browser doesn't support it
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={isListening ? stopListening : startListening}
      disabled={disabled}
      className={cn('h-auto', isListening && 'text-red-600 animate-pulse')}
      aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
      title={isListening ? 'Stop listening' : 'Voice input'}
    >
      {isListening ? (
        <MicOff className="h-4 w-4" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </Button>
  );
}

