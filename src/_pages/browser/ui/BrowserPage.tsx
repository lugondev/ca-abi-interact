import { ContractsList } from "@widgets/contracts-list";
import { ContractBrowser } from "@widgets/contract-browser";
import { Sidebar, WithSidebar } from "@shared/ui/Sidebar";

export const BrowserPage = () => {
  return (
    <WithSidebar
      sidebar={
        <Sidebar className="w-[320px] flex-shrink-0">
          <ContractsList />
        </Sidebar>
      }
    >
      <ContractBrowser />
    </WithSidebar>
  );
};
