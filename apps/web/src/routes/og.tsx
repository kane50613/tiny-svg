import ImageResponse from "@takumi-rs/image-response";
import { createFileRoute } from "@tanstack/react-router";
import BaseTemplate from "@/components/og/base-template";

export const Route = createFileRoute("/og")({
  server: {
    handlers: {
      GET({ request }) {
        const host = new URL(request.url).host;
        return new ImageResponse(
          <BaseTemplate
            description={
              "Fast, secure, and client-side SVG compression with real-time preview"
            }
            site={host}
            title={"Optimize Your SVG Files"}
          />,
          {
            width: 1200,
            height: 630,
            format: "webp",
          }
        );
      },
    },
  },
});
