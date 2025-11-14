import { contractModel } from "@entities/contract";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertiesList } from "./PropertiesList";
import { CallsList } from "./CallsList";
import { OperationsList } from "./OperationsList";
import { EventsList } from "./EventsList";
import { FileText } from "lucide-react";

export const ContractBrowser = () => {
  const contract = contractModel.useCurrentContract();

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
    <div className="w-full">
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
        <TabsContent value="properties" key={`${key}-properties`}>
          <PropertiesList contract={contract} />
        </TabsContent>
        <TabsContent value="calls" key={`${key}-calls`}>
          <CallsList contract={contract} />
        </TabsContent>
        <TabsContent value="operations" key={`${key}-operations`}>
          <OperationsList contract={contract} />
        </TabsContent>
        <TabsContent value="events" key={`${key}-events`}>
          <EventsList contract={contract} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
