import { useEffect, useState } from "react";
import { useWeb3 } from "@/contexts/Web3Context";
import { useLocation } from "wouter";
import Navigation from "@/components/Navigation";
import RegisterForm from "@/components/RegisterForm";
import JobsList from "@/components/JobsList";
import PostJobForm from "@/components/PostJobForm";
import MyJobsView from "@/components/MyJobsView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  const { account, isConnected, isClient, isFreelancer, disconnectWallet } = useWeb3();
  const [, setLocation] = useLocation();
  const [userRole, setUserRole] = useState<"client" | "freelancer" | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!isConnected) {
      setLocation("/");
      return;
    }

    const checkUserRole = async () => {
      if (account) {
        const isClientResult = await isClient(account);
        const isFreelancerResult = await isFreelancer(account);

        if (isClientResult) setUserRole("client");
        else if (isFreelancerResult) setUserRole("freelancer");
        else setUserRole(null);
      }
      setLoading(false);
    };

    checkUserRole();
  }, [account, isConnected, isClient, isFreelancer, setLocation]);

  const handleDisconnect = () => {
    disconnectWallet();
    setLocation("/");
  };

  if (!isConnected) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!userRole) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation onDisconnect={handleDisconnect} account={account} />
        <div className="container mx-auto px-4 py-8">
          <RegisterForm />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation onDisconnect={handleDisconnect} account={account} userRole={userRole} />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
          <p className="text-slate-600">
            Welcome back! You're logged in as a <span className="font-semibold text-teal-600">{userRole}</span>.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Active Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">0</div>
              <p className="text-xs text-slate-500 mt-1">In progress</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Total Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">0 ETH</div>
              <p className="text-xs text-slate-500 mt-1">Completed jobs</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Reputation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">New</div>
              <p className="text-xs text-slate-500 mt-1">Build your profile</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="jobs">
              {userRole === "client" ? "Post Job" : "Browse Jobs"}
            </TabsTrigger>
            <TabsTrigger value="my-jobs">My Jobs</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle>Getting Started</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userRole === "client" ? (
                    <>
                      <p className="text-slate-600">
                        As a client, you can post jobs and hire freelancers. Here's how to get started:
                      </p>
                      <ol className="space-y-2 text-slate-600 list-decimal list-inside">
                        <li>Go to the "Post Job" tab</li>
                        <li>Enter the freelancer's wallet address</li>
                        <li>Describe the job and set the payment amount in ETH</li>
                        <li>Post the job and deposit funds</li>
                        <li>Once work is submitted, review and release payment</li>
                      </ol>
                    </>
                  ) : (
                    <>
                      <p className="text-slate-600">
                        As a freelancer, you can browse available jobs and submit work. Here's how to get started:
                      </p>
                      <ol className="space-y-2 text-slate-600 list-decimal list-inside">
                        <li>Go to the "Browse Jobs" tab</li>
                        <li>View available jobs posted by clients</li>
                        <li>Once funds are deposited, submit your work</li>
                        <li>Wait for the client to review and release payment</li>
                        <li>Receive payment directly to your wallet</li>
                      </ol>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jobs">
            {userRole === "client" ? (
              <PostJobForm />
            ) : (
              <JobsList userRole={userRole} />
            )}
          </TabsContent>

          <TabsContent value="my-jobs">
            <MyJobsView userRole={userRole} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
