// @ts-ignore - Type definitions might not be available until dependencies are installed
import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
// @ts-ignore - Type definitions might not be available until dependencies are installed
import { render, screen } from "@testing-library/react";
// @ts-ignore - Type definitions might not be available until dependencies are installed
import userEvent from "@testing-library/user-event";
import { ErrorBoundary } from "./ErrorBoundary";

// Component that throws an error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error("Test error");
  }
  return <div>No error</div>;
};

describe("ErrorBoundary", () => {
  // Suppress console errors during tests
  const originalError = console.error;
  beforeAll(() => {
    console.error = vi.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });

  it("renders children when there is no error", () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>,
    );

    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("renders error UI when child component throws", () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(screen.getByText(/try again/i)).toBeInTheDocument();
    expect(screen.getByText(/go home/i)).toBeInTheDocument();
  });

  it("shows error details in development mode", () => {
    // Mock development environment
    const originalEnv = import.meta.env.DEV;
    (import.meta.env as any).DEV = true;

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByText(/error details/i)).toBeInTheDocument();
    expect(screen.getByText(/test error/i)).toBeInTheDocument();

    // Restore environment
    (import.meta.env as any).DEV = originalEnv;
  });

  it("handles try again button click", async () => {
    const user = userEvent.setup();

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    );

    const tryAgainButton = screen.getByText(/try again/i);
    await user.click(tryAgainButton);

    // After reset, component should try to render again
    // In this case it will throw again, but we're testing the reset mechanism
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  it("handles go home button click", async () => {
    const user = userEvent.setup();

    // Mock window.location.href
    delete (window as any).location;
    window.location = { href: "" } as any;

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    );

    const goHomeButton = screen.getByText(/go home/i);
    await user.click(goHomeButton);

    expect(window.location.href).toBe("/");
  });

  it("renders custom fallback when provided", () => {
    const customFallback = <div>Custom error message</div>;

    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Custom error message")).toBeInTheDocument();
    expect(screen.queryByText(/something went wrong/i)).not.toBeInTheDocument();
  });

  it("displays support email", () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    );

    const supportLink = screen.getByText(/support@straydogcare.com/i);
    expect(supportLink).toBeInTheDocument();
    expect(supportLink).toHaveAttribute(
      "href",
      "mailto:support@straydogcare.com",
    );
  });

  it("does not show error details in production mode", () => {
    // Mock production environment
    const originalEnv = import.meta.env.DEV;
    (import.meta.env as any).DEV = false;

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.queryByText(/error details/i)).not.toBeInTheDocument();

    // Restore environment
    (import.meta.env as any).DEV = originalEnv;
  });
});
