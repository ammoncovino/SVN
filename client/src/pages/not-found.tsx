import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Leaf } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <Card className="p-8 text-center max-w-sm">
        <Leaf className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
        <h1 className="text-lg font-bold mb-2">Lost in the Forest</h1>
        <p className="text-sm text-muted-foreground mb-4">
          This path doesn't lead anywhere. The forest floor has reclaimed it.
        </p>
        <Link href="/">
          <Button variant="outline" size="sm">
            Return to the Proving Grounds
          </Button>
        </Link>
      </Card>
    </div>
  );
}
