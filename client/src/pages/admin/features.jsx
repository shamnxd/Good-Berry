import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Wrench } from "lucide-react";

function AdminFeatures() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Admin Features</h1>
      <p className="text-sm text-muted-foreground">
        This section is ready for upcoming feature controls and operational tools.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-600" />
            <CardTitle className="text-base">What this page is for</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Manage feature toggles, experiments, and release controls for the admin workflow.
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Wrench className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-base">Current status</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            No tools are connected yet. Add feature modules here as they are implemented.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AdminFeatures;