import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, IndianRupee } from 'lucide-react';
import { useAddCommission } from '../hooks/useQueries';

interface AddCommissionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CATEGORIES = [
  'Recharge & Bill Pay',
  'Money Transfer',
  'Merchant Payment',
  'Insurance',
  'Mutual Funds',
  'Gold',
  'Travel',
  'Shopping',
  'Other',
];

function generateId(): string {
  return `TXN-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

function formatCurrency(value: number): string {
  if (isNaN(value)) return '₹0.00';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(value);
}

export default function AddCommissionForm({ open, onOpenChange }: AddCommissionFormProps) {
  const [merchantName, setMerchantName] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);

  const addMutation = useAddCommission();

  const parsedAmount = parseFloat(amount);
  const parsedRate = parseFloat(rate);
  const commissionEarned =
    !isNaN(parsedAmount) && !isNaN(parsedRate) && parsedAmount > 0 && parsedRate > 0
      ? (parsedAmount * parsedRate) / 100
      : 0;

  const isValid =
    merchantName.trim().length > 0 &&
    category.length > 0 &&
    !isNaN(parsedAmount) && parsedAmount > 0 &&
    !isNaN(parsedRate) && parsedRate > 0 && parsedRate <= 100 &&
    date.length > 0;

  const resetForm = () => {
    setMerchantName('');
    setCategory('');
    setAmount('');
    setRate('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  useEffect(() => {
    if (!open) resetForm();
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    const transactionDate = BigInt(new Date(date).getTime()) * BigInt(1_000_000);

    try {
      await addMutation.mutateAsync({
        transactionId: generateId(),
        transactionAmount: parsedAmount,
        commissionRate: parsedRate,
        transactionDate,
        merchantName: merchantName.trim(),
        category,
      });
      toast.success('Commission entry added successfully!');
      onOpenChange(false);
    } catch (err) {
      toast.error('Failed to add entry. Please try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] border-border/60">
        <DialogHeader>
          <DialogTitle className="text-xl font-extrabold text-foreground">
            Add Commission Entry
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Record a new PhonePe commission transaction.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          {/* Merchant Name */}
          <div className="space-y-1.5">
            <Label htmlFor="merchantName" className="text-sm font-semibold">
              Merchant / Agent Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="merchantName"
              placeholder="e.g. Ramesh Stores"
              value={merchantName}
              onChange={(e) => setMerchantName(e.target.value)}
              className="border-border/60 focus-visible:ring-accent"
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label htmlFor="category" className="text-sm font-semibold">
              Category <span className="text-destructive">*</span>
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category" className="border-border/60 focus:ring-accent">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Amount & Rate Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="amount" className="text-sm font-semibold">
                Transaction Amount (₹) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="amount"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="e.g. 5000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="border-border/60 focus-visible:ring-accent"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="rate" className="text-sm font-semibold">
                Commission Rate (%) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="rate"
                type="number"
                min="0.01"
                max="100"
                step="0.01"
                placeholder="e.g. 1.5"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="border-border/60 focus-visible:ring-accent"
              />
            </div>
          </div>

          {/* Date */}
          <div className="space-y-1.5">
            <Label htmlFor="date" className="text-sm font-semibold">
              Transaction Date <span className="text-destructive">*</span>
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border-border/60 focus-visible:ring-accent"
            />
          </div>

          {/* Auto-calculated Commission */}
          <div className="rounded-xl bg-secondary/60 border border-border/40 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-commission-high" />
                <span className="text-sm font-semibold text-foreground">Commission Earned</span>
              </div>
              <span className={`text-lg font-extrabold ${commissionEarned > 0 ? 'text-commission-high' : 'text-muted-foreground'}`}>
                {formatCurrency(commissionEarned)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">
              Auto-calculated: Amount × Rate ÷ 100
            </p>
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={addMutation.isPending}
              className="border-border/60"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isValid || addMutation.isPending}
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold gap-2"
            >
              {addMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {addMutation.isPending ? 'Saving...' : 'Add Entry'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
