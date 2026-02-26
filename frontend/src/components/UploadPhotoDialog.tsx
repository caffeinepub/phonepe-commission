import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { Upload, ImagePlus, Loader2, X } from 'lucide-react';
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
import { useAddCustomerPhoto } from '../hooks/useQueries';

interface UploadPhotoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  totalPhotos: number;
}

export default function UploadPhotoDialog({ open, onOpenChange, totalPhotos }: UploadPhotoDialogProps) {
  const [name, setName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [nameError, setNameError] = useState('');
  const [fileError, setFileError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addPhotoMutation = useAddCustomerPhoto();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setFileError('');
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreview(ev.target?.result as string);
    };
    reader.readAsDataURL(selected);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClose = () => {
    setName('');
    setFile(null);
    setPreview(null);
    setNameError('');
    setFileError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    onOpenChange(false);
  };

  const handleUpload = async () => {
    let valid = true;
    if (!name.trim()) {
      setNameError('Please enter a name for this photo.');
      valid = false;
    } else {
      setNameError('');
    }
    if (!file) {
      setFileError('Please select an image file.');
      valid = false;
    } else {
      setFileError('');
    }
    if (!valid) return;

    try {
      const arrayBuffer = await file!.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const newId = BigInt(totalPhotos + Date.now());

      await addPhotoMutation.mutateAsync({
        id: newId,
        photo: {
          front_id_card_image_name: name.trim(),
          front_id_card_image: uint8Array,
        },
      });

      toast.success(`Photo "${name.trim()}" uploaded successfully!`);
      handleClose();
    } catch {
      toast.error('Failed to upload photo. Please try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md border-border/60">
        <DialogHeader>
          <DialogTitle className="text-lg font-extrabold text-foreground flex items-center gap-2">
            <ImagePlus className="w-5 h-5 text-accent" />
            Upload Customer Photo
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Add a customer photo with a name label. It will be saved securely on-chain.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Name input */}
          <div className="space-y-1.5">
            <Label htmlFor="photo-name" className="text-sm font-semibold text-foreground">
              Customer Name / Label
            </Label>
            <Input
              id="photo-name"
              placeholder="e.g. Rahul Sharma"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (e.target.value.trim()) setNameError('');
              }}
              className="border-border/60"
            />
            {nameError && <p className="text-xs text-destructive">{nameError}</p>}
          </div>

          {/* File picker */}
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-foreground">Photo</Label>
            {preview ? (
              <div className="relative rounded-xl overflow-hidden border border-border/60 bg-muted aspect-video flex items-center justify-center">
                <img src={preview} alt="Preview" className="max-h-48 object-contain" />
                <button
                  onClick={handleRemoveFile}
                  className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-destructive/90 hover:bg-destructive text-destructive-foreground flex items-center justify-center shadow"
                  aria-label="Remove image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-border/60 hover:border-accent/60 rounded-xl p-8 flex flex-col items-center gap-2 text-muted-foreground hover:text-accent transition-colors duration-200 bg-muted/30"
              >
                <Upload className="w-8 h-8" />
                <span className="text-sm font-medium">Click to select an image</span>
                <span className="text-xs">JPG, PNG, WEBP supported</span>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            {fileError && <p className="text-xs text-destructive">{fileError}</p>}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={addPhotoMutation.isPending}
            className="border-border/60"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={addPhotoMutation.isPending}
            className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
          >
            {addPhotoMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {addPhotoMutation.isPending ? 'Uploading...' : 'Upload Photo'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
