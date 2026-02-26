import { useState } from 'react';
import { Images, Upload, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCustomerPhotos } from '../hooks/useQueries';
import PhotoCard from './PhotoCard';
import UploadPhotoDialog from './UploadPhotoDialog';
import { Skeleton } from '@/components/ui/skeleton';

export default function CustomerPhotosGallery() {
  const [uploadOpen, setUploadOpen] = useState(false);
  const { data: photos, isLoading, refetch, isFetching } = useCustomerPhotos();

  return (
    <section className="container mx-auto px-6 py-8">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center">
            <Images className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
              Customer Photos
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {photos ? `${photos.length} photo${photos.length !== 1 ? 's' : ''} saved` : 'Loading...'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="gap-2 border-border/60"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={() => setUploadOpen(true)}
            className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
          >
            <Upload className="w-4 h-4" />
            Upload Photo
          </Button>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-2xl overflow-hidden border border-border/60 bg-card">
              <Skeleton className="w-full aspect-square" />
              <div className="p-3 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && (!photos || photos.length === 0) && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-5">
            <Images className="w-10 h-10 text-muted-foreground/50" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">No photos yet</h3>
          <p className="text-sm text-muted-foreground max-w-xs mb-6">
            Upload your first customer photo to get started. Photos are saved securely on-chain.
          </p>
          <Button
            onClick={() => setUploadOpen(true)}
            className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
          >
            <Upload className="w-4 h-4" />
            Upload First Photo
          </Button>
        </div>
      )}

      {/* Photo grid */}
      {!isLoading && photos && photos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {photos.map((photo, index) => (
            <PhotoCard key={index} photo={photo} photoIndex={index} />
          ))}
        </div>
      )}

      <UploadPhotoDialog open={uploadOpen} onOpenChange={setUploadOpen} totalPhotos={photos?.length ?? 0} />
    </section>
  );
}
