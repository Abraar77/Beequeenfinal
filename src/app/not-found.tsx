import Link from "next/link";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 text-center">
      <div>
        <p className="font-display text-8xl font-bold text-shimmer mb-4">404</p>
        <h1 className="text-2xl font-semibold text-white mb-3">Page Not Found</h1>
        <p className="text-gray-500 mb-8">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/">
          <Button variant="pink" size="lg">
            <span>Go Home</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
