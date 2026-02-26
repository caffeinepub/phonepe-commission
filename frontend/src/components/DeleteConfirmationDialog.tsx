import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';
import { useDeleteCommission } from '../hooks/useQueries';

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transactionId: string;
  merchantName: string;
}

export default function DeleteConfirmationDialog({
  open,
  onOpenChange,
  transactionId,
  merchantName,
}: DeleteConfirmationDialogProps) {
  const deleteMutation = useDeleteCommission();

  const handleConfirm = async () => {
    try {
      await deleteMutation.mutateAsync(transactionId);
      toast.success(`Entry for "${merchantName}" deleted.`);
      onOpenChange(false);
    } catch {
      toast.error('Failed to delete entry. Please try again.');
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-border/60">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-extrabold text-foreground">
            Delete Commission Entry?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            This will permanently delete the commission entry for{' '}
            <span className="font-semibold text-foreground">"{merchantName}"</span>.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel
            disabled={deleteMutation.isPending}
            className="border-border/60"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={deleteMutation.isPending}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold gap-2 flex items-center"
          >
            {deleteMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
