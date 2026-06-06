import type { Root } from "fumadocs-core/page-tree";
import { componentDocs } from "./component-docs";

export const docsTree: Root = {
  name: "Open Shell",
  children: [
    {
      type: "page",
      name: "Introduction",
      url: "/docs",
    },
    {
      type: "page",
      name: "Installation",
      url: "/docs/installation",
    },
    {
      type: "page",
      name: "Architecture",
      url: "/docs/architecture",
    },
    {
      type: "page",
      name: "Slots System",
      url: "/docs/slots",
    },
    {
      type: "page",
      name: "Theming",
      url: "/docs/theming",
    },
    {
      type: "folder",
      name: "Components",
      defaultOpen: true,
      index: {
        type: "page",
        name: "Components",
        url: "/docs/components",
      },
      children: componentDocs.map((component) => ({
        type: "page",
        name: component.title,
        url: `/docs/components/${component.slug}`,
      })),
    },
    {
      type: "folder",
      name: "Examples",
      defaultOpen: true,
      children: [
        {
          type: "page",
          name: "Electron Shell",
          url: "/docs/examples/electron",
        },
      ],
    },
  ],
};
