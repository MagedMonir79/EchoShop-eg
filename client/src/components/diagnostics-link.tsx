import { Wrench } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from './ui/button';

export function DiagnosticsLink() {
  return (
    <div className="fixed bottom-4 left-4 z-50">
      <Link href="/diagnostic">
        <Button variant="outline" size="sm" className="group">
          <Wrench className="h-4 w-4 mr-2 group-hover:animate-spin" />
          التشخيص
        </Button>
      </Link>
    </div>
  );
}