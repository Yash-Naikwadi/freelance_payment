import { Button } from "@/components/ui/button";
import { Zap, LogOut } from "lucide-react";
import { useLocation } from "wouter";

export default function Navigation({ onDisconnect, account, userRole }) {
  const [, setLocation] = useLocation();

  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => setLocation("/dashboard")}
        >
          <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900">FreelanceChain</span>
        </div>

        <div className="flex items-center gap-4">
          {userRole && (
            <div className="px-3 py-1 bg-teal-50 border border-teal-200 rounded-full text-sm font-medium text-teal-700">
              {userRole === "client" ? "👤 Client" : "💻 Freelancer"}
            </div>
          )}

          {account && (
            <div className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-600 font-mono">
              {formatAddress(account)}
            </div>
          )}

          <Button
            onClick={onDisconnect}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            Disconnect
          </Button>
        </div>
      </div>
    </nav>
  );
}