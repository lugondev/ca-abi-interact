import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useSettings, TRefreshInterval } from "@entities/settings";

const intervalOptions: { value: TRefreshInterval; label: string }[] = [
  { value: 5, label: "5 seconds" },
  { value: 10, label: "10 seconds" },
  { value: 15, label: "15 seconds" },
  { value: 30, label: "30 seconds" },
  { value: 60, label: "1 minute" },
];

export const RefreshSettings = () => {
  const { settings, updateRefreshEnabled, updateRefreshInterval } = useSettings();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Auto Refresh Settings</CardTitle>
        <CardDescription>
          Configure automatic refresh for "Refresh All" button. Individual property refresh buttons are always available.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="auto-refresh">Auto Refresh</Label>
            <div className="text-sm text-muted-foreground">
              Automatically refresh all contract properties at regular intervals
            </div>
          </div>
          <Switch
            id="auto-refresh"
            checked={settings.refresh.enabled}
            onCheckedChange={updateRefreshEnabled}
          />
        </div>

        {settings.refresh.enabled && (
          <div className="space-y-2">
            <Label htmlFor="refresh-interval">Refresh Interval</Label>
            <Select
              value={settings.refresh.interval.toString()}
              onValueChange={(value) => updateRefreshInterval(parseInt(value) as TRefreshInterval)}
            >
              <SelectTrigger id="refresh-interval">
                <SelectValue placeholder="Select interval" />
              </SelectTrigger>
              <SelectContent>
                {intervalOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value.toString()}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {!settings.refresh.enabled && (
          <div className="text-sm text-muted-foreground">
            When auto refresh is disabled, use the "Refresh All" button to manually refresh all properties at once. Individual property refresh buttons are always available.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
