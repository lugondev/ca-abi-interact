import { Spinner } from "@/components/ui/spinner";

export const LoadingScreen = () => {
  return (
    <div className="h-screen flex flex-col gap-8 mx-auto items-center justify-center">
      <Spinner size="lg" />
      <p className="text-muted-foreground">Chain list loading...</p>
    </div>
  );
};
