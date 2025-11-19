/**
 * Lazy-loaded wrapper for ReactTabContent
 * Code viewer and syntax highlighter loaded on-demand for better performance
 */

import { lazy, Suspense } from "react";

const ReactTabContentComponent = lazy(() =>
  import("@/components/optimize/react-tab-content").then((mod) => ({
    default: mod.ReactTabContent,
  }))
);

type ReactTabContentProps = {
  generatedCodes: Map<string, string>;
  componentName: string;
};

export function ReactTabContentLazy(props: ReactTabContentProps) {
  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center">
          <div className="text-muted-foreground">
            Loading React code viewer...
          </div>
        </div>
      }
    >
      <ReactTabContentComponent {...props} />
    </Suspense>
  );
}
