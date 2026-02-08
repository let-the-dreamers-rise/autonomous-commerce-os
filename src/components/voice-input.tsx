'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Loader2, Sparkles } from 'lucide-react';

// Extend Window interface for Web Speech API
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

interface VoiceInputProps {
    onTranscript: (text: string) => void;
    disabled?: boolean;
}

interface SpeechRecognitionEvent extends Event {
    resultIndex: number;
    results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
    error: string;
}

export default function VoiceInput({ onTranscript, disabled }: VoiceInputProps) {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [isSupported, setIsSupported] = useState(false);
    const [pulseScale, setPulseScale] = useState(1);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        // Check for browser support
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            setIsSupported(true);
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
                let finalTranscript = '';
                let interimTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const result = event.results[i];
                    if (result.isFinal) {
                        finalTranscript += result[0].transcript;
                    } else {
                        interimTranscript += result[0].transcript;
                    }
                }

                setTranscript(interimTranscript || finalTranscript);

                if (finalTranscript) {
                    onTranscript(finalTranscript);
                    setIsListening(false);
                    recognitionRef.current?.stop();
                }
            };

            recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }

        return () => {
            recognitionRef.current?.stop();
        };
    }, [onTranscript]);

    // Pulse animation while listening
    useEffect(() => {
        if (isListening) {
            const interval = setInterval(() => {
                setPulseScale((prev) => (prev === 1 ? 1.15 : 1));
            }, 500);
            return () => clearInterval(interval);
        }
    }, [isListening]);

    const toggleListening = () => {
        if (!isSupported || disabled) return;

        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            setTranscript('');
            recognitionRef.current?.start();
            setIsListening(true);
        }
    };

    if (!isSupported) {
        return null; // Hide if not supported
    }

    return (
        <div className="relative">
            <motion.button
                onClick={toggleListening}
                disabled={disabled}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{ scale: isListening ? pulseScale : 1 }}
                className={`
          relative p-4 rounded-full transition-all duration-300
          ${isListening
                        ? 'bg-red-500 shadow-lg shadow-red-500/50'
                        : 'bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/30'
                    }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
                title={isListening ? 'Stop listening' : 'Click to speak'}
            >
                {isListening ? (
                    <MicOff className="w-6 h-6 text-white" />
                ) : (
                    <Mic className="w-6 h-6 text-white" />
                )}

                {/* Ripple effect when listening */}
                {isListening && (
                    <>
                        <motion.div
                            className="absolute inset-0 rounded-full bg-red-500"
                            animate={{ scale: [1, 1.5, 1.5], opacity: [0.5, 0, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        />
                        <motion.div
                            className="absolute inset-0 rounded-full bg-red-500"
                            animate={{ scale: [1, 1.8, 1.8], opacity: [0.3, 0, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                        />
                    </>
                )}
            </motion.button>

            {/* Live transcript display */}
            <AnimatePresence>
                {isListening && transcript && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.9 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-4 py-2 rounded-xl bg-card border border-border shadow-xl min-w-[200px] max-w-[300px]"
                    >
                        <div className="flex items-center gap-2 text-sm">
                            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                            <span className="text-muted-foreground">{transcript}</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Listening indicator */}
            <AnimatePresence>
                {isListening && !transcript && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/30"
                    >
                        <div className="flex items-center gap-2 text-xs text-red-400">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>Listening...</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
