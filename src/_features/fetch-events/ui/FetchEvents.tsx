import { useState, useCallback } from "react";
import { TAbiEvent, TContract } from "@entities/contract";
import { EventArgsForm } from "./EventArgsForm";
import { TEventQuery } from "../model/types";
import { useFetchEvents } from "../model/useFetchEvents";
import { EventsTable } from "./EventsTable";
import { useAutoRefresh } from "@shared/lib/refresh";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

type TProps = {
  contract: TContract;
  event: TAbiEvent;
};

export const FetchEvents = ({ contract, event }: TProps) => {
  const { loading, fetch, events } = useFetchEvents(contract, event);
  const [lastQuery, setLastQuery] = useState<TEventQuery | null>(null);

  const submit = useCallback((values: TEventQuery) => {
    setLastQuery(values);
    fetch(values);
  }, [fetch]);

  const refreshWithLastQuery = useCallback(() => {
    if (lastQuery) {
      fetch(lastQuery);
    }
  }, [fetch, lastQuery]);

  const { isAutoRefreshEnabled } = useAutoRefresh({
    onRefresh: refreshWithLastQuery,
    enabled: lastQuery !== null, // Only auto-refresh if we have fetched at least once
  });

  return (
    <div className="space-y-3">
      <EventArgsForm onSubmit={submit} event={event} loading={loading} />
      
      {/* Manual refresh button when auto-refresh is disabled and we have data */}
      {!isAutoRefreshEnabled && lastQuery && events.length > 0 && (
        <div className="flex justify-end">
          <Button 
            onClick={refreshWithLastQuery} 
            variant="outline" 
            size="sm" 
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh Events'}
          </Button>
        </div>
      )}
      
      <EventsTable
        chain={contract.chain}
        event={event}
        items={events}
        loading={loading}
      />
    </div>
  );
};
