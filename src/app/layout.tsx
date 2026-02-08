import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'Agentic Commerce | Autonomous Multi-Retailer Purchasing AI',
    description: 'The future of commerce: AI agents that plan, discover, optimize, and purchase across multiple retailers autonomously.',
    keywords: ['AI', 'commerce', 'multi-agent', 'shopping', 'automation', 'procurement'],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark">
            <body className="antialiased">
                <div className="fixed inset-0 animated-gradient -z-10" />
                <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent -z-10" />
                {children}
            </body>
        </html>
    );
}
