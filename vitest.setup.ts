import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";
import React from "react";

// Mock next/font/google
vi.mock("next/font/google", () => ({
  Newsreader: () => ({
    variable: "--font-newsreader",
    className: "font-serif",
  }),
  Plus_Jakarta_Sans: () => ({
    variable: "--font-plus-jakarta",
    className: "font-sans",
  }),
}));

// Mock next/image without JSX in .ts file
vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement> & { src: string }) => {
    return React.createElement("img", {
      ...props,
      alt: props.alt || "",
    });
  },
}));

// Mock server-only package to allow testing server utilities
vi.mock("server-only", () => ({}));
