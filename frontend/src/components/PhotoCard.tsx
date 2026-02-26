import { useState } from 'react';
import { Trash2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { FrontPhoto } from '../backend';
import DeletePhotoDialog from './DeletePhotoDialog';

interface PhotoCardProps {
  photo: FrontPhoto;
  photoIndex: number;
}

export default function PhotoCard({ photo, photoIndex }: PhotoCardProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Convert Uint8Array to blob URL for display
  const imageUrl = (() => {
    try {
      const blob = new Blob([new Uint8Array(photo.front_id_card_image)], { type: 'image/jpeg' });
      return URL.createObjectURL(blob);
    } catch {
      return null;
    }
  })();

  return (
    <>
      <Card className="group overflow-hidden border border-border/60 bg-card shadow-card hover:shadow-lg transition-all duration-200 rounded-2xl">
        <div className="relative aspect-square overflow-hidden bg-muted">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={photo.front_id_card_image_name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User className="w-12 h-12 text-muted-foreground/40" />
            </div>
          )}
          {/* Delete button overlay */}
          <button
            onClick={() => setDeleteOpen(true)}
            className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-destructive/90 hover:bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md"
            aria-label="Delete photo"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
        <CardContent className="p-3">
          <p className="font-semibold text-sm text-foreground truncate" title={photo.front_id_card_image_name}>
            {photo.front_id_card_image_name}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">Customer Photo</p>
        </CardContent>
      </Card>

      <DeletePhotoDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        photoId={BigInt(photoIndex)}
        photoName={photo.front_id_card_image_name}
      />
    </>
  );
}
