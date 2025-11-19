"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

export default function EpochConverter() {
  const [timestamp, setTimestamp] = useState<string>("");
  const [dateString, setDateString] = useState<string>("");
  const [isoString, setIsoString] = useState<string>("");
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  useEffect(() => {
    const now = Math.floor(Date.now() / 1000).toString();
    setTimestamp(now);
    updateDate(now);
  }, []);

  const updateDate = (ts: string) => {
    try {
      const date = new Date(parseInt(ts) * 1000);
      setDateString(date.toString());
      setIsoString(date.toISOString());
    } catch (e) {
      setDateString("Invalid Date");
      setIsoString("");
    }
  };

  const handleTimestampChange = (value: string) => {
    setTimestamp(value);
    if (!value) {
      setDateString("");
      setIsoString("");
      return;
    }
    updateDate(value);
  };

  const handleSetCurrent = () => {
    const now = Math.floor(Date.now() / 1000).toString();
    setTimestamp(now);
    updateDate(now);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Epoch Converter</CardTitle>
          <CardDescription>
            Convert between Unix timestamps and human-readable dates.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="timestamp">Unix Timestamp</Label>
            <div className="flex gap-2">
              <Input
                id="timestamp"
                placeholder="1678886400"
                value={timestamp}
                onChange={(e) => handleTimestampChange(e.target.value)}
              />
              <Button onClick={handleSetCurrent} variant="outline">Current</Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(timestamp, "timestamp")}
                disabled={!timestamp}
              >
                {copied === "timestamp" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Local Date</Label>
            <div className="flex gap-2">
              <div className="p-2 bg-muted rounded-md min-h-[2.5rem] flex items-center flex-1">
                {dateString}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(dateString, "date")}
                disabled={!dateString}
              >
                {copied === "date" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>ISO Date (UTC)</Label>
            <div className="flex gap-2">
              <div className="p-2 bg-muted rounded-md min-h-[2.5rem] flex items-center flex-1">
                {isoString}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(isoString, "iso")}
                disabled={!isoString}
              >
                {copied === "iso" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
