import { render, waitFor } from "@testing-library/svelte";
import CopyButton from "../src/lib/components/CopyButton.svelte";
import { describe, expect, test } from "vitest";
import userEvent from "@testing-library/user-event";

describe("Copy button", () => {
  test("renders as a button with the right text", () => {
    const { getByText } = render(CopyButton, { textToCopy: "Copy this text" });

    expect(getByText("Copy")).toBeInTheDocument();
  });
  test("changes text when clicked and then changes back", async () => {
    const { getByText } = render(CopyButton, { textToCopy: "Copy this text" });
    const user = userEvent.setup();

    await user.click(getByText("Copy"));

    expect(getByText("Copied")).toBeInTheDocument();

    await waitFor(() => expect(getByText("Copy")).toBeInTheDocument(), {
      timeout: 1600,
    });
  });
});
