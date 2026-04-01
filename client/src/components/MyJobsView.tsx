import { useState, useEffect } from "react";
import { useWeb3 } from "@/contexts/Web3Context";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Loader2 } from "lucide-react";

interface Job {
  id: number;
  client: string;
  freelancer: string;
  amount: string;
  description: string;
  fundsDeposited: boolean;
  workSubmitted: boolean;
  paymentReleased: boolean;
}

interface MyJobsViewProps {
  userRole: "client" | "freelancer";
}

export default function MyJobsView({ userRole }: MyJobsViewProps) {
  const { getNextJobId, getJob, account } = useWeb3();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      try {
        const nextId = await getNextJobId();
        if (!nextId) {
          setJobs([]);
          setLoading(false);
          return;
        }

        const jobsList: Job[] = [];
        for (let i = 1; i < nextId; i++) {
          const job = await getJob(i);
          if (job) {
            jobsList.push({
              id: i,
              ...job,
            });
          }
        }

        // Filter jobs based on user role
        if (userRole === "freelancer") {
          const filtered = jobsList.filter(job => job.freelancer.toLowerCase() === account?.toLowerCase());
          setJobs(filtered);
        } else {
          const filtered = jobsList.filter(job => job.client.toLowerCase() === account?.toLowerCase());
          setJobs(filtered);
        }
      } catch (err) {
        console.error("Error loading jobs:", err);
      }
      setLoading(false);
    };

    loadJobs();
  }, [getNextJobId, getJob, userRole, account]);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getJobStatus = (job: Job) => {
    if (job.paymentReleased) return { label: "Completed", color: "emerald" };
    if (job.workSubmitted) return { label: "Work Submitted", color: "amber" };
    if (job.fundsDeposited) return { label: "In Progress", color: "blue" };
    return { label: "Pending", color: "slate" };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-teal-500 mx-auto mb-2 animate-spin" />
          <p className="text-slate-600">Loading your jobs...</p>
        </div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <Card className="border-slate-200">
        <CardContent className="py-12 text-center">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No jobs yet</h3>
          <p className="text-slate-600">
            {userRole === "freelancer"
              ? "You don't have any jobs assigned yet."
              : "You haven't posted any jobs yet."}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map(job => {
        const status = getJobStatus(job);
        const statusColors: Record<string, string> = {
          emerald: "bg-emerald-50 border-emerald-200 text-emerald-700",
          amber: "bg-amber-50 border-amber-200 text-amber-700",
          blue: "bg-blue-50 border-blue-200 text-blue-700",
          slate: "bg-slate-50 border-slate-200 text-slate-700",
        };

        return (
          <Card key={job.id} className="border-slate-200">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">Job #{job.id}</h3>
                  <p className="text-slate-600 text-sm">{job.description}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium border ${statusColors[status.color]}`}>
                  {status.label}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-slate-500 mb-1">Amount</p>
                  <p className="font-bold text-teal-600">{job.amount} ETH</p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1">{userRole === "client" ? "Freelancer" : "Client"}</p>
                  <p className="font-mono text-slate-900">
                    {formatAddress(userRole === "client" ? job.freelancer : job.client)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1">Funds</p>
                  <p className="text-slate-900">{job.fundsDeposited ? "✓ Deposited" : "Pending"}</p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1">Work</p>
                  <p className="text-slate-900">{job.workSubmitted ? "✓ Submitted" : "Pending"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
