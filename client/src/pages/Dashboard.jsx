import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  HiOutlineBriefcase,
  HiOutlineCalendar,
  HiOutlineStar,
  HiOutlineTrendingUp,
  HiOutlineArrowRight,
  HiOutlineClock,
} from 'react-icons/hi';
import { jobService, interviewService } from '../services/resourceService';
import StatusBadge from '../components/shared/StatusBadge';
import Button from '../components/shared/Button';
import { StatCardSkeleton } from '../components/shared/Skeleton';

const statusColors = {
  Applied: { bg: 'bg-blue-500', light: 'bg-blue-100 dark:bg-blue-900/30' },
  OA: { bg: 'bg-amber-500', light: 'bg-amber-100 dark:bg-amber-900/30' },
  Interview: { bg: 'bg-purple-500', light: 'bg-purple-100 dark:bg-purple-900/30' },
  Rejected: { bg: 'bg-red-500', light: 'bg-red-100 dark:bg-red-900/30' },
  Offer: { bg: 'bg-emerald-500', light: 'bg-emerald-100 dark:bg-emerald-900/30' },
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [upcomingInterviews, setUpcomingInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, interviewsRes] = await Promise.all([
          jobService.getStats(),
          interviewService.getUpcoming(),
        ]);
        setStats(statsRes.data.data);
        setUpcomingInterviews(interviewsRes.data.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <div className="skeleton h-8 w-48 mb-2" />
          <div className="skeleton h-5 w-72" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Applications',
      value: stats?.total || 0,
      icon: HiOutlineBriefcase,
      color: 'from-blue-500 to-blue-600',
      shadow: 'shadow-blue-500/20',
    },
    {
      label: 'Interviews',
      value: stats?.statusCounts?.Interview || 0,
      icon: HiOutlineCalendar,
      color: 'from-purple-500 to-purple-600',
      shadow: 'shadow-purple-500/20',
    },
    {
      label: 'Offers',
      value: stats?.statusCounts?.Offer || 0,
      icon: HiOutlineStar,
      color: 'from-emerald-500 to-emerald-600',
      shadow: 'shadow-emerald-500/20',
    },
    {
      label: 'Response Rate',
      value: `${stats?.responseRate || 0}%`,
      icon: HiOutlineTrendingUp,
      color: 'from-amber-500 to-orange-500',
      shadow: 'shadow-amber-500/20',
    },
  ];

  const allStatuses = ['Applied', 'OA', 'Interview', 'Rejected', 'Offer'];
  const maxCount = Math.max(...allStatuses.map((s) => stats?.statusCounts?.[s] || 0), 1);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Dashboard</h1>
        <p className="text-surface-500 dark:text-surface-400 mt-1">
          Overview of your job search progress
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <div
            key={card.label}
            className={`glass-card p-5 hover-card animate-slide-up`}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg ${card.shadow}`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold text-surface-900 dark:text-white">{card.value}</p>
            <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Distribution */}
        <div className="lg:col-span-2 glass-card p-6 animate-slide-up animate-delay-200">
          <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-5">
            Application Status
          </h2>
          <div className="space-y-4">
            {allStatuses.map((status) => {
              const count = stats?.statusCounts?.[status] || 0;
              const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
              return (
                <div key={status} className="flex items-center gap-4">
                  <div className="w-24 flex-shrink-0">
                    <StatusBadge status={status} size="sm" />
                  </div>
                  <div className="flex-1 h-3 bg-surface-100 dark:bg-surface-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${statusColors[status].bg} rounded-full transition-all duration-1000 ease-out`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-surface-700 dark:text-surface-300 w-8 text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Interviews */}
        <div className="glass-card p-6 animate-slide-up animate-delay-300">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-surface-900 dark:text-white">
              Upcoming Interviews
            </h2>
            <Link to="/interviews">
              <HiOutlineArrowRight className="w-5 h-5 text-surface-400 hover:text-primary-500 transition-colors" />
            </Link>
          </div>
          {upcomingInterviews.length > 0 ? (
            <div className="space-y-3">
              {upcomingInterviews.map((interview) => (
                <div
                  key={interview._id}
                  className="p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-200 dark:border-surface-700 hover:border-primary-300 dark:hover:border-primary-700 transition-colors"
                >
                  <p className="text-sm font-medium text-surface-900 dark:text-white">
                    {interview.job?.company || 'Company'}
                  </p>
                  <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">
                    {interview.job?.position || 'Position'} • {interview.type}
                  </p>
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-primary-600 dark:text-primary-400">
                    <HiOutlineClock className="w-3.5 h-3.5" />
                    {new Date(interview.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-sm text-surface-400">
              <HiOutlineCalendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
              No upcoming interviews
            </div>
          )}
        </div>
      </div>

      {/* Recent Applications */}
      <div className="glass-card p-6 animate-slide-up animate-delay-400">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-surface-900 dark:text-white">
            Recent Applications
          </h2>
          <Link to="/jobs">
            <Button variant="ghost" size="sm" icon={HiOutlineArrowRight}>
              View All
            </Button>
          </Link>
        </div>
        {stats?.recentJobs?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                  <th className="pb-3 pr-4">Position</th>
                  <th className="pb-3 pr-4">Company</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 pr-4 hidden sm:table-cell">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
                {stats.recentJobs.map((job) => (
                  <tr key={job._id} className="hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
                    <td className="py-3 pr-4">
                      <Link to={`/jobs/${job._id}`} className="text-sm font-medium text-surface-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                        {job.position}
                      </Link>
                    </td>
                    <td className="py-3 pr-4 text-sm text-surface-600 dark:text-surface-400">
                      {job.company}
                    </td>
                    <td className="py-3 pr-4">
                      <StatusBadge status={job.status} size="sm" />
                    </td>
                    <td className="py-3 pr-4 text-sm text-surface-500 dark:text-surface-400 hidden sm:table-cell">
                      {new Date(job.appliedDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center py-8 text-sm text-surface-400">
            No applications yet. Start by adding your first job!
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
