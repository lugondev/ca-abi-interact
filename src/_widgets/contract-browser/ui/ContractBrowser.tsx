import { contractModel } from "@entities/contract";
import { chainModel } from "@entities/chain";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertiesList } from "./PropertiesList";
import { CallsList } from "./CallsList";
import { OperationsList } from "./OperationsList";
import { EventsList } from "./EventsList";
import { RefreshProvider } from "@shared/lib/refresh";
import { AddressValue } from "@shared/ui/AddressValue";
import { FileText } from "lucide-react";

export const ContractBrowser = () => {
  const contract = contractModel.useCurrentContract();
  const { getAddressUrl } = chainModel.useChainExplorer(contract?.chain || 1);

  if (!contract) {
    return (
      <Card className="mt-8">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <FileText className="h-12 w-12 text-muted-foreground" />
          </div>
          <CardTitle>No smart contract selected</CardTitle>
          <CardDescription>
            Select a contract from the sidebar or add a new one to get started
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const key = `${contract.address}${contract.chain}`;

  return (
    <RefreshProvider>
      <div className="w-full">
        {/* Contract Header */}
        <div className="mb-6 p-4 border rounded-lg bg-card">
          <div className="space-y-3">
            <div>
              <h2 className="text-xl font-semibold text-foreground">{contract.name}</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground font-medium">Address:</span>
              <AddressValue 
                value={contract.address} 
                shorten={false} 
                explorerUrl={getAddressUrl(contract.address)}
              />
            </div>
          </div>
        </div>

        <Tabs defaultValue="properties" className="w-full">
          <div className="overflow-x-auto pb-2">
            <TabsList className="grid w-full grid-cols-4 min-w-[600px] sm:min-w-0">
              <TabsTrigger value="properties" className="text-xs sm:text-sm">
                Properties
              </TabsTrigger>
              <TabsTrigger value="calls" className="text-xs sm:text-sm">
                Calls
              </TabsTrigger>
              <TabsTrigger value="operations" className="text-xs sm:text-sm">
                Operations
              </TabsTrigger>
              <TabsTrigger value="events" className="text-xs sm:text-sm">
                Events
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="properties" key={`${key}-properties`} className="border rounded-lg p-6">
            <PropertiesList contract={contract} />
          </TabsContent>
          <TabsContent value="calls" key={`${key}-calls`} className="border rounded-lg p-6">
            <CallsList contract={contract} />
          </TabsContent>
          <TabsContent value="operations" key={`${key}-operations`} className="border rounded-lg p-6">
            <OperationsList contract={contract} />
          </TabsContent>
          <TabsContent value="events" key={`${key}-events`} className="border rounded-lg p-6">
            <EventsList contract={contract} />
          </TabsContent>
        </Tabs>
      </div>
    </RefreshProvider>
  );
};
