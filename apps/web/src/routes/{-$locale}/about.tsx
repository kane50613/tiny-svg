import { createFileRoute } from "@tanstack/react-router";
import { useIntlayer } from "react-intlayer";

export const Route = createFileRoute("/{-$locale}/about")({
  component: AboutComponent,
});

const DEPENDENCY_LINKS = [
  { href: "https://github.com/svg/svgo", key: "svgo" },
  { href: "https://tanstack.com/router", key: "router" },
  { href: "https://tanstack.com/start", key: "start" },
  { href: "https://react.dev", key: "react" },
  { href: "https://intlayer.org", key: "intlayer" },
  { href: "https://www.radix-ui.com", key: "radix" },
  { href: "https://github.com/wooorm/refractor", key: "refractor" },
  { href: "https://prettier.io", key: "prettier" },
  { href: "https://tailwindcss.com", key: "tailwind" },
  { href: "https://biomejs.dev", key: "biome" },
  { href: "https://vite.dev", key: "vite" },
] as const;

function AboutComponent() {
  const {
    title,
    whatIsSection,
    featuresSection,
    authorSection,
    dependenciesSection,
    openSourceSection,
  } = useIntlayer("about");

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 font-bold text-4xl">{title}</h1>

      <section aria-labelledby="what-is-heading" className="mb-8">
        <h2 className="mb-4 font-semibold text-2xl" id="what-is-heading">
          {whatIsSection.title}
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          {whatIsSection.description}
        </p>
      </section>

      <section aria-labelledby="features-heading" className="mb-8">
        <h2 className="mb-4 font-semibold text-2xl" id="features-heading">
          {featuresSection.title}
        </h2>
        <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
          <li>{featuresSection.items.compression}</li>
          <li>{featuresSection.items.preview}</li>
          <li>{featuresSection.items.customizable}</li>
          <li>{featuresSection.items.noServer}</li>
          <li>{featuresSection.items.dragDrop}</li>
          <li>{featuresSection.items.codeDiff}</li>
        </ul>
      </section>

      <section aria-labelledby="author-heading" className="mb-8">
        <h2 className="mb-4 font-semibold text-2xl" id="author-heading">
          {authorSection.title}
        </h2>
        <p className="text-muted-foreground">
          {authorSection.createdBy}{" "}
          <a
            href="https://hehehai.cn"
            rel="noopener noreferrer"
            target="_blank"
          >
            [hehehai]
          </a>
        </p>
      </section>

      <section aria-labelledby="dependencies-heading" className="mb-8">
        <h2 className="mb-4 font-semibold text-2xl" id="dependencies-heading">
          {dependenciesSection.title}
        </h2>
        <p className="mb-4 text-muted-foreground">
          {dependenciesSection.description}
        </p>
        <nav aria-label="Project dependencies" className="grid gap-3">
          {DEPENDENCY_LINKS.map(({ href, key }) => (
            <a
              className="text-primary hover:underline"
              href={href}
              key={key}
              rel="noopener noreferrer"
              target="_blank"
            >
              {dependenciesSection.libraries[key]}
            </a>
          ))}
        </nav>
      </section>

      <section aria-labelledby="opensource-heading">
        <h2 className="mb-4 font-semibold text-2xl" id="opensource-heading">
          {openSourceSection.title}
        </h2>
        <p className="mb-4 text-muted-foreground">
          {openSourceSection.description}
        </p>
        <a
          className="inline-flex items-center gap-2 text-primary hover:underline"
          href="https://github.com/hehehai/tiny-svg"
          rel="noopener noreferrer"
          target="_blank"
        >
          <span aria-hidden="true" className="i-hugeicons-github size-5" />
          {openSourceSection.viewOnGitHub}
        </a>
      </section>
    </div>
  );
}
