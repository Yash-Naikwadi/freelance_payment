import { useState, useEffect } from "react";
import { useWeb3 } from "@/contexts/Web3Context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function PostJobForm() {
  const { postJob, account, error } = useWeb3();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    freelancerAddress: "",
    description: "",
    amount: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.freelancerAddress || !formData.description || !formData.amount) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(formData.freelancerAddress)) {
      toast.error("Invalid Ethereum address");
      return;
    }

    if (parseFloat(formData.amount) <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }

    setLoading(true);
    const success = await postJob(
      formData.freelancerAddress,
      formData.description,
      formData.amount
    );
    setLoading(false);

    if (success) {
      toast.success("Job posted successfully!");
      setFormData({ freelancerAddress: "", description: "", amount: "" });
    } else {
      toast.error(error || "Failed to post job");
    }
  };

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle>Post a New Job</CardTitle>
        <CardDescription>
          Create a job listing and specify the freelancer you want to hire
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Freelancer Wallet Address
            </label>
            <Input
              type="text"
              name="freelancerAddress"
              placeholder="0x..."
              value={formData.freelancerAddress}
              onChange={handleChange}
              className="font-mono"
              disabled={loading}
            />
            <p className="text-xs text-slate-500 mt-1">
              The wallet address of the freelancer you want to hire
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Job Description
            </label>
            <Textarea
              name="description"
              placeholder="Describe the job details, requirements, and deliverables..."
              value={formData.description}
              onChange={handleChange}
              rows={4}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Payment Amount (ETH)
            </label>
            <Input
              type="number"
              name="amount"
              placeholder="0.5"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={handleChange}
              disabled={loading}
            />
            <p className="text-xs text-slate-500 mt-1">
              The amount in ETH to be held in escrow
            </p>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Posting Job...
              </>
            ) : (
              "Post Job"
            )}
          </Button>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
