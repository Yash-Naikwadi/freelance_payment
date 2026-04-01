import { useState } from "react";
import { useWeb3 } from "@/contexts/Web3Context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { CheckCircle2, User, Briefcase } from "lucide-react";

export default function RegisterForm() {
  const { registerAsClient, registerAsFreelancer, error } = useWeb3();
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);

  const handleRegisterClient = async () => {
    setLoading(true);
    const success = await registerAsClient();
    setLoading(false);

    if (success) {
      toast.success("Successfully registered as a Client!");
      setRegistered(true);
      setTimeout(() => window.location.reload(), 1500);
    } else {
      toast.error(error || "Failed to register as client");
    }
  };

  const handleRegisterFreelancer = async () => {
    setLoading(true);
    const success = await registerAsFreelancer();
    setLoading(false);

    if (success) {
      toast.success("Successfully registered as a Freelancer!");
      setRegistered(true);
      setTimeout(() => window.location.reload(), 1500);
    } else {
      toast.error(error || "Failed to register as freelancer");
    }
  };

  if (registered) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Registration Successful!</h2>
          <p className="text-slate-600">Reloading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Choose Your Role</h1>
        <p className="text-slate-600">
          Select whether you want to post jobs or apply for work.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Client Card */}
        <Card className="border-slate-200 hover:shadow-lg transition-all cursor-pointer hover:border-teal-300">
          <CardHeader>
            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
              <User className="w-6 h-6 text-teal-600" />
            </div>
            <CardTitle>Register as Client</CardTitle>
            <CardDescription>Post jobs and hire freelancers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex gap-2">
                <span className="text-teal-500">✓</span>
                <span>Post job listings</span>
              </li>
              <li className="flex gap-2">
                <span className="text-teal-500">✓</span>
                <span>Deposit funds securely</span>
              </li>
              <li className="flex gap-2">
                <span className="text-teal-500">✓</span>
                <span>Review and approve work</span>
              </li>
              <li className="flex gap-2">
                <span className="text-teal-500">✓</span>
                <span>Release payments instantly</span>
              </li>
            </ul>
            <Button
              onClick={handleRegisterClient}
              disabled={loading}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white"
            >
              {loading ? "Registering..." : "Register as Client"}
            </Button>
          </CardContent>
        </Card>

        {/* Freelancer Card */}
        <Card className="border-slate-200 hover:shadow-lg transition-all cursor-pointer hover:border-amber-300">
          <CardHeader>
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
              <Briefcase className="w-6 h-6 text-amber-600" />
            </div>
            <CardTitle>Register as Freelancer</CardTitle>
            <CardDescription>Browse and apply for jobs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex gap-2">
                <span className="text-amber-500">✓</span>
                <span>Browse available jobs</span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-500">✓</span>
                <span>Submit your work</span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-500">✓</span>
                <span>Get paid instantly</span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-500">✓</span>
                <span>Build your reputation</span>
              </li>
            </ul>
            <Button
              onClick={handleRegisterFreelancer}
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white"
            >
              {loading ? "Registering..." : "Register as Freelancer"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
