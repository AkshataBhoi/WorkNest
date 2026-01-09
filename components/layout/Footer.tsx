import Logo from "@/components/ui/Logo";

export default function Footer() {
    return (
        <footer className="relative z-10 border-t border-white/10 bg-black/20 backdrop-blur-md py-8 sm:py-12">
            <div className="container mx-auto px-6 sm:px-12">
                <div className="flex flex-col items-center text-center space-y-4">
                    <Logo variant="gradient" size="md" />
                    <p className="text-sm text-slate-400 max-w-md">
                        Organize work. Together.
                    </p>
                    <p className="text-xs text-slate-600 font-medium">
                        &copy; 2026 WorkNest. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
