import { createFileRoute } from "@tanstack/react-router";
import { OptimizeLayout } from "@/components/optimize/optimize-layout";
import { useOptimizePage } from "@/hooks/use-optimize-page";

export const Route = createFileRoute("/{-$locale}/optimize")({
  component: OptimizeComponent,
});

function OptimizeComponent() {
  const optimizeProps = useOptimizePage();

  return <OptimizeLayout {...optimizeProps} />;
}
