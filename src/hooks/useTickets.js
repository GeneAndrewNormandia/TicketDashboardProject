import { useCallback, useEffect, useState } from "react";
import { normalizeTickets } from "../utils/tickets";

const DEFAULT_FILE = "ticketing_system.json";
const DEFAULT_URL = `${import.meta.env.BASE_URL}${DEFAULT_FILE}`;

function describeError(err) {
  if (err instanceof SyntaxError) {
    return "The file is not valid JSON. Check for a missing comma, bracket or quote.";
  }
  return err?.message || "Something went wrong while reading the tickets.";
}

// Loads tickets from /public/ticketing_system.json, or from a file the user picks.
export default function useTickets() {
  const [state, setState] = useState({
    status: "loading", // "loading" | "ready" | "error"
    tickets: [],
    error: "",
    source: DEFAULT_FILE,
  });

  const loadDefault = useCallback(async (signal) => {
    setState((s) => ({ ...s, status: "loading", error: "" }));
    try {
      const res = await fetch(DEFAULT_URL, { signal });
      if (!res.ok) {
        throw new Error(`Could not load ${DEFAULT_FILE} (HTTP ${res.status}).`);
      }
      const raw = await res.json();
      setState({ status: "ready", tickets: normalizeTickets(raw), error: "", source: DEFAULT_FILE });
    } catch (err) {
      if (err.name === "AbortError") return;
      setState({ status: "error", tickets: [], error: describeError(err), source: DEFAULT_FILE });
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadDefault(controller.signal);
    return () => controller.abort();
  }, [loadDefault]);

  const loadFile = useCallback(async (file) => {
    setState((s) => ({ ...s, status: "loading", error: "" }));
    try {
      const raw = JSON.parse(await file.text());
      setState({ status: "ready", tickets: normalizeTickets(raw), error: "", source: file.name });
    } catch (err) {
      setState({ status: "error", tickets: [], error: describeError(err), source: file.name });
    }
  }, []);

  const reload = useCallback(() => loadDefault(), [loadDefault]);

  return { ...state, loadFile, reload };
}
