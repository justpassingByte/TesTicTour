import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function SettingsTab() {
  return (
    <Card className="bg-card/60 dark:bg-card/40 backdrop-blur-lg border border-white/20">
      <CardHeader>
        <CardTitle>Platform Settings</CardTitle>
        <CardDescription>Configure API keys, notification settings, and platform defaults.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-center py-8 text-muted-foreground">
          Settings interface will be displayed here.
        </p>
      </CardContent>
    </Card>
  );
} 