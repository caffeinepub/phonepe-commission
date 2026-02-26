import { useState } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { IndianRupee, BarChart3, TrendingUp, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import SummaryCard from './SummaryCard';
import CommissionTable from './CommissionTable';
import AddCommissionForm from './AddCommissionForm';
import { useGetAllCommissions, useGetStats } from '../hooks/useQueries';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(value);
}

function formatNumber(value: number | bigint): string {
  return new Intl.NumberFormat('en-IN').format(Number(value));
}

export default function CommissionDashboard() {
  const [addFormOpen, setAddFormOpen] = useState(false);

  const { data: commissions, isLoading: commissionsLoading, refetch } = useGetAllCommissions();
  const { data: stats, isLoading: statsLoading } = useGetStats();

  const isLoading = commissionsLoading || statsLoading;

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      {/* Page Title Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Dashboard</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Track and manage your PhonePe commission earnings
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={() => setAddFormOpen(true)}
            className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Entry
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))
        ) : (
          <>
            <SummaryCard
              title="Total Transactions"
              value={formatNumber(stats?.totalTransactions ?? BigInt(0))}
              subtitle="All time entries"
              icon={Hash}
              iconColor="text-primary"
              gradient="bg-gradient-to-br from-primary to-transparent"
            />
            <SummaryCard
              title="Total Volume"
              value={formatCurrency(stats?.totalTransactionVolume ?? 0)}
              subtitle="Transaction amount"
              icon={IndianRupee}
              iconColor="text-accent"
              gradient="bg-gradient-to-br from-accent to-transparent"
            />
            <SummaryCard
              title="Commission Earned"
              value={formatCurrency(stats?.totalCommissionEarned ?? 0)}
              subtitle="Total earnings"
              icon={BarChart3}
              iconColor="text-commission-high"
              gradient="bg-gradient-to-br from-commission-high to-transparent"
            />
            <SummaryCard
              title="Avg. Commission Rate"
              value={`${(stats?.averageCommissionRate ?? 0).toFixed(2)}%`}
              subtitle="Across all entries"
              icon={TrendingUp}
              iconColor="text-commission-medium"
              gradient="bg-gradient-to-br from-commission-medium to-transparent"
            />
          </>
        )}
      </div>

      {/* Commission Table */}
      <CommissionTable
        entries={commissions ?? []}
        isLoading={commissionsLoading}
      />

      {/* Add Commission Form Modal */}
      <AddCommissionForm
        open={addFormOpen}
        onOpenChange={setAddFormOpen}
      />
    </div>
  );
}
