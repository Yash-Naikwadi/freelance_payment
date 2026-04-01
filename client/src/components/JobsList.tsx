import { useState, useEffect } from "react";
import { useWeb3 } from "@/contexts/Web3Context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
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

interface JobsListProps {
  userRole: "client" | "freelancer";
}

export default function JobsList({ userRole }: JobsListProps) {
  const { getNextJobId, getJob, submitWork, depositFunds, releasePayment, account, error } = useWeb3();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

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
        toast.error("Failed to load jobs");
      }
      setLoading(false);
    };

    loadJobs();
  }, [getNextJobId, getJob, userRole, account]);

  const handleSubmitWork = async (jobId: number) => {
    setActionLoading(jobId);
    const success = await submitWork(jobId);
    setActionLoading(null);

    if (success) {
      toast.success("Work submitted successfully!");
      // Reload jobs
      window.location.reload();
    } else {
      toast.error(error || "Failed to submit work");
    }
  };

  const handleDepositFunds = async (jobId: number, amount: string) => {
    setActionLoading(jobId);
    const success = await depositFunds(jobId, amount);
    setActionLoading(null);

    if (success) {
      toast.success("Funds deposited successfully!");
      window.location.reload();
    } else {
      toast.error(error || "Failed to deposit funds");
    }
  };

  const handleReleasePayment = async (jobId: number) => {
    setActionLoading(jobId);
    const success = await releasePayment(jobId);
    setActionLoading(null);

    if (success) {
      toast.success("Payment released successfully!");
      window.location.reload();
    } else {
      toast.error(error || "Failed to release payment");
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-teal-500 mx-auto mb-2 animate-spin" />
          <p className="text-slate-600">Loading jobs...</p>
        </div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <Card className="border-slate-200">
        <CardContent className="py-12 text-center">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No jobs found</h3>
          <p className="text-slate-600">
            {userRole === "freelancer"
              ? "No jobs have been posted for you yet."
              : "You haven't posted any jobs yet."}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map(job => (
        <Card key={job.id} className="border-slate-200 hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg">Job #{job.id}</CardTitle>
                <CardDescription>{job.description}</CardDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-teal-600">{job.amount} ETH</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Job Status Timeline */}
            <div className="flex items-center gap-2 text-sm">
              <div className={`w-3 h-3 rounded-full ${job.fundsDeposited ? "bg-emerald-500" : "bg-slate-300"}`} />
              <span className={job.fundsDeposited ? "text-emerald-700 font-medium" : "text-slate-500"}>
                Funds Deposited
              </span>
              <span className="text-slate-300">→</span>
              <div className={`w-3 h-3 rounded-full ${job.workSubmitted ? "bg-emerald-500" : "bg-slate-300"}`} />
              <span className={job.workSubmitted ? "text-emerald-700 font-medium" : "text-slate-500"}>
                Work Submitted
              </span>
              <span className="text-slate-300">→</span>
              <div className={`w-3 h-3 rounded-full ${job.paymentReleased ? "bg-emerald-500" : "bg-slate-300"}`} />
              <span className={job.paymentReleased ? "text-emerald-700 font-medium" : "text-slate-500"}>
                Payment Released
              </span>
            </div>

            {/* Job Details */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-500">Client</p>
                <p className="font-mono text-slate-900">{formatAddress(job.client)}</p>
              </div>
              <div>
                <p className="text-slate-500">Freelancer</p>
                <p className="font-mono text-slate-900">{formatAddress(job.freelancer)}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              {userRole === "client" && (
                <>
                  {!job.fundsDeposited && (
                    <Button
                      onClick={() => handleDepositFunds(job.id, job.amount)}
                      disabled={actionLoading === job.id}
                      className="flex-1 bg-teal-500 hover:bg-teal-600"
                    >
                      {actionLoading === job.id ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Depositing...
                        </>
                      ) : (
                        "Deposit Funds"
                      )}
                    </Button>
                  )}
                  {job.workSubmitted && !job.paymentReleased && (
                    <Button
                      onClick={() => handleReleasePayment(job.id)}
                      disabled={actionLoading === job.id}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                    >
                      {actionLoading === job.id ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Releasing...
                        </>
                      ) : (
                        "Release Payment"
                      )}
                    </Button>
                  )}
                </>
              )}

              {userRole === "freelancer" && (
                <>
                  {job.fundsDeposited && !job.workSubmitted && (
                    <Button
                      onClick={() => handleSubmitWork(job.id)}
                      disabled={actionLoading === job.id}
                      className="flex-1 bg-amber-500 hover:bg-amber-600"
                    >
                      {actionLoading === job.id ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Work"
                      )}
                    </Button>
                  )}
                </>
              )}

              {job.paymentReleased && (
                <div className="flex-1 flex items-center justify-center bg-emerald-50 border border-emerald-200 rounded-lg">
                  <span className="text-emerald-700 font-medium">✓ Completed</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
