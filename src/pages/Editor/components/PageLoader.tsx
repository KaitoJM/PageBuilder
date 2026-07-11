import { Spinner } from "@/components/ui/spinner";
import { usePageDataStore } from "../services/pageData";

export default function PageLoader() {
  const isLoading = usePageDataStore((state) => state.isLoading);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Spinner className="size-8 text-white" />
    </div>
  );
}
