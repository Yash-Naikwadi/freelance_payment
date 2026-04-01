import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useWeb3 } from "@/contexts/Web3Context";
import { ArrowRight, Lock, Zap } from "lucide-react";
import { useLocation } from "wouter";

export default function Home() {
  const { isConnected, connectWallet, error } = useWeb3();
  const [, setLocation] = useLocation();

  const handleConnect = async () => {
    const success = await connectWallet();
    if (success) {
      setLocation("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">FreelanceChain</span>
          </div>
          <div className="text-sm text-slate-600">Secure Blockchain Payments</div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-slate-900 mb-4">
              Secure Freelance Payments on Blockchain
            </h1>
            <p className="text-xl text-slate-600 mb-8">
              Connect your wallet to post jobs, submit work, and release payments with complete transparency and security.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="border-slate-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Lock className="w-8 h-8 text-teal-500 mb-2" />
                <CardTitle className="text-lg">Escrow Protection</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Funds are held securely until work is submitted and approved.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Zap className="w-8 h-8 text-amber-500 mb-2" />
                <CardTitle className="text-lg">Instant Settlement</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Payments are released instantly on blockchain with no intermediaries.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Lock className="w-8 h-8 text-emerald-500 mb-2" />
                <CardTitle className="text-lg">Transparent Workflow</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Every transaction is recorded on-chain for complete transparency.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Ready to get started?
            </h2>
            <p className="text-slate-600 mb-6">
              Connect your MetaMask wallet to access the platform. Make sure you're connected to Ganache (localhost:8545).
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <Button
              onClick={handleConnect}
              disabled={isConnected}
              size="lg"
              className="bg-teal-500 hover:bg-teal-600 text-white"
            >
              {isConnected ? "Connected ✓" : "Connect MetaMask Wallet"}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>

            {isConnected && (
              <div className="mt-4">
                <Button
                  onClick={() => setLocation("/dashboard")}
                  variant="outline"
                  size="lg"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Setup Instructions */}
          <div className="mt-12 bg-slate-50 rounded-xl p-8 border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Setup Instructions</h3>
            <ol className="space-y-3 text-slate-700">
              <li className="flex gap-3">
                <span className="font-bold text-teal-500">1.</span>
                <span>Install MetaMask browser extension if not already installed</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-teal-500">2.</span>
                <span>Start Ganache on your local machine (default: localhost:8545)</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-teal-500">3.</span>
                <span>Add Ganache network to MetaMask with RPC URL: http://127.0.0.1:8545</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-teal-500">4.</span>
                <span>Import Ganache accounts into MetaMask using private keys</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-teal-500">5.</span>
                <span>Deploy smart contracts to Ganache and update .env with contract addresses</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-teal-500">6.</span>
                <span>Connect your wallet and start posting jobs or applying for work</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
