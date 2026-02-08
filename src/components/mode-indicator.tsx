'use client';

import { Cpu, Zap } from 'lucide-react';

// Client-side is always simulation mode
// Live API mode only runs on server-side
export default function ModeIndicator() {
    // Check for live mode via environment variable
    const isLive = process.env.NEXT_PUBLIC_API_MODE === 'live';

    return (
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${isLive
            ? 'bg-accent/20 text-accent border border-accent/30'
            : 'bg-muted text-muted-foreground border border-border'
            }`}>
            {isLive ? (
                <>
                    <Zap className="w-3 h-3" />
                    <span>Live API</span>
                </>
            ) : (
                <>
                    <Cpu className="w-3 h-3" />
                    <span>Simulation</span>
                </>
            )}
        </div>
    );
}
