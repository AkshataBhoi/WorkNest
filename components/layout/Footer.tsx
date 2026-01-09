import { cn } from "@/lib/utils";

export default function Footer() {
    return (
        <footer className="relative z-10 border-t border-white/10 bg-black/20 backdrop-blur-md py-12">
            <div className="container mx-auto px-6 text-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center gap-2 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        <div className="h-6 w-6 rounded-md bg-gradient-to-br from-primary to-purple-600" />
                        <span className="text-lg font-bold tracking-tight text-white">WorkNest</span>
                    </div>
                    <p className="text-sm text-slate-500">
                        &copy; 2026 WorkNest. Built for performance and collaboration.
                    </p>
                </div>
            </div>
        </footer>
    );
}
