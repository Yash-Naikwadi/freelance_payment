import { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';
import JobCard from './JobCard';
import './JobsList.css';

export default function JobsList({ userRole }) {
  const { getNextJobId, getJob } = useWeb3();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const nextId = await getNextJobId();
        if (nextId) {
          const jobsArray = [];
          for (let i = 1; i < parseInt(nextId); i++) {
            const job = await getJob(i);
            if (job) {
              jobsArray.push({ id: i, ...job });
            }
          }
          setJobs(jobsArray);
        }
      } catch (err) {
        console.error('Error loading jobs:', err);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, [getNextJobId, getJob]);

  if (loading) {
    return <div className="jobs-loading">Loading jobs...</div>;
  }

  if (jobs.length === 0) {
    return (
      <div className="jobs-empty">
        <p>No jobs found yet</p>
      </div>
    );
  }

  return (
    <div className="jobs-list-container">
      <h2>Available Jobs</h2>
      <div className="jobs-grid">
        {jobs.map(job => (
          <JobCard key={job.id} job={job} userRole={userRole} />
        ))}
      </div>
    </div>
  );
}