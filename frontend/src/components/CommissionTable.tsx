import { useState } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import type { CommissionEntry } from '../backend';

interface CommissionTableProps {
  entries: CommissionEntry[];
  isLoading: boolean;
}

type SortKey = keyof Pick<
  CommissionEntry,
  'transactionDate' | 'merchantName' | 'category' | 'transactionAmount' | 'commissionRate' | 'commissionEarned'
>;

type SortDirection = 'asc' | 'desc';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(timestamp: bigint): string {
  const ms = Number(timestamp) / 1_000_000;
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(ms));
}

function getCommissionBadge(earned: number) {
  if (earned >= 50) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-commission-high/10 text-commission-high border border-commission-high/20">
        {formatCurrency(earned)}
      </span>
    );
  } else if (earned >= 20) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-commission-medium/10 text-commission-medium border border-commission-medium/20">
        {formatCurrency(earned)}
      </span>
    );
  } else {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-commission-low/10 text-commission-low border border-commission-low/20">
        {formatCurrency(earned)}
      </span>
    );
  }
}

function SortIcon({ column, sortKey, direction }: { column: SortKey; sortKey: SortKey; direction: SortDirection }) {
  if (column !== sortKey) return <ArrowUpDown className="w-3.5 h-3.5 opacity-40" />;
  return direction === 'asc'
    ? <ArrowUp className="w-3.5 h-3.5 text-accent" />
    : <ArrowDown className="w-3.5 h-3.5 text-accent" />;
}

export default function CommissionTable({ entries, isLoading }: CommissionTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('transactionDate');
  const [sortDir, setSortDir] = useState<SortDirection>('desc');
  const [deleteTarget, setDeleteTarget] = useState<CommissionEntry | null>(null);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sorted = [...entries].sort((a, b) => {
    let aVal: number | string = 0;
    let bVal: number | string = 0;

    switch (sortKey) {
      case 'transactionDate':
        aVal = Number(a.transactionDate);
        bVal = Number(b.transactionDate);
        break;
      case 'merchantName':
        aVal = a.merchantName.toLowerCase();
        bVal = b.merchantName.toLowerCase();
        break;
      case 'category':
        aVal = a.category.toLowerCase();
        bVal = b.category.toLowerCase();
        break;
      case 'transactionAmount':
        aVal = a.transactionAmount;
        bVal = b.transactionAmount;
        break;
      case 'commissionRate':
        aVal = a.commissionRate;
        bVal = b.commissionRate;
        break;
      case 'commissionEarned':
        aVal = a.commissionEarned;
        bVal = b.commissionEarned;
        break;
    }

    if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const SortableHead = ({ label, col }: { label: string; col: SortKey }) => (
    <TableHead
      className="cursor-pointer select-none hover:text-foreground transition-colors whitespace-nowrap"
      onClick={() => handleSort(col)}
    >
      <div className="flex items-center gap-1.5 font-semibold text-xs uppercase tracking-wider">
        {label}
        <SortIcon column={col} sortKey={sortKey} direction={sortDir} />
      </div>
    </TableHead>
  );

  return (
    <>
      <Card className="shadow-card border-border/60">
        <CardHeader className="pb-4 border-b border-border/40">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold text-foreground">
              Commission Entries
            </CardTitle>
            <Badge variant="secondary" className="font-semibold">
              {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          ) : entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
                <ArrowUpDown className="w-7 h-7 text-muted-foreground" />
              </div>
              <p className="text-base font-semibold text-foreground mb-1">No entries yet</p>
              <p className="text-sm text-muted-foreground">
                Click "Add Entry" to record your first commission.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                    <SortableHead label="Date" col="transactionDate" />
                    <SortableHead label="Merchant / Agent" col="merchantName" />
                    <SortableHead label="Category" col="category" />
                    <SortableHead label="Txn Amount" col="transactionAmount" />
                    <SortableHead label="Rate (%)" col="commissionRate" />
                    <SortableHead label="Commission" col="commissionEarned" />
                    <TableHead className="text-xs font-semibold uppercase tracking-wider w-16">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sorted.map((entry) => (
                    <TableRow
                      key={entry.transactionId}
                      className="hover:bg-secondary/30 transition-colors"
                    >
                      <TableCell className="text-sm font-medium text-foreground whitespace-nowrap">
                        {formatDate(entry.transactionDate)}
                      </TableCell>
                      <TableCell className="text-sm font-semibold text-foreground max-w-[180px] truncate">
                        {entry.merchantName}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs font-medium border-border/60">
                          {entry.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm font-medium text-foreground whitespace-nowrap">
                        {formatCurrency(entry.transactionAmount)}
                      </TableCell>
                      <TableCell className="text-sm font-medium text-foreground">
                        {entry.commissionRate.toFixed(2)}%
                      </TableCell>
                      <TableCell>
                        {getCommissionBadge(entry.commissionEarned)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          onClick={() => setDeleteTarget(entry)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {deleteTarget && (
        <DeleteConfirmationDialog
          open={!!deleteTarget}
          onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
          transactionId={deleteTarget.transactionId}
          merchantName={deleteTarget.merchantName}
        />
      )}
    </>
  );
}
