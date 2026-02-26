import { Heart } from 'lucide-react';

export default function AppFooter() {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(
    typeof window !== 'undefined' ? window.location.hostname : 'phonepe-commission'
  );

  return (
    <footer className="border-t border-border/60 bg-card mt-auto">
      <div className="container mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          © {year} PhonePe Commission Tracker. All rights reserved.
        </p>
        <p className="text-sm text-muted-foreground flex items-center gap-1.5">
          Built with{' '}
          <Heart className="w-3.5 h-3.5 fill-accent text-accent" />{' '}
          using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-accent hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </footer>
  );
}
