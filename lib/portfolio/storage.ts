"use client";

/**
 * Portfolio localStorage hook + persistence.
 * SSR safe: 초기 로드 전에는 빈 상태, 마운트 후 동기화.
 */

import { useCallback, useEffect, useState } from "react";
import type { Holding, PortfolioState } from "./types";

const STORAGE_KEY = "poket:portfolio:v1";
const SCHEMA_VERSION = 1 as const;

const EMPTY: PortfolioState = { schemaVersion: SCHEMA_VERSION, holdings: [] };

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readStorage(): PortfolioState {
  if (!isBrowser()) return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as PortfolioState;
    if (parsed.schemaVersion !== SCHEMA_VERSION) return EMPTY;
    if (!Array.isArray(parsed.holdings)) return EMPTY;
    return parsed;
  } catch {
    return EMPTY;
  }
}

function writeStorage(state: PortfolioState): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn("[portfolio] localStorage 쓰기 실패:", err);
  }
}

function makeId(): string {
  if (isBrowser() && typeof window.crypto?.randomUUID === "function") {
    return window.crypto.randomUUID();
  }
  return `h_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export interface UsePortfolioApi {
  /** 마운트 + 초기 로드 완료 여부 */
  hydrated: boolean;
  holdings: Holding[];
  addHolding: (input: Omit<Holding, "id" | "createdAt">) => void;
  removeHolding: (id: string) => void;
  updateHolding: (id: string, patch: Partial<Omit<Holding, "id" | "createdAt">>) => void;
  clearAll: () => void;
  /** 외부 storage 변경 강제 reload */
  reload: () => void;
}

export function usePortfolio(): UsePortfolioApi {
  const [state, setState] = useState<PortfolioState>(EMPTY);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(readStorage());
    setHydrated(true);

    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setState(readStorage());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const commit = useCallback((next: PortfolioState) => {
    setState(next);
    writeStorage(next);
  }, []);

  const addHolding = useCallback<UsePortfolioApi["addHolding"]>(
    (input) => {
      const holding: Holding = {
        ...input,
        id: makeId(),
        createdAt: new Date().toISOString()
      };
      commit({
        schemaVersion: SCHEMA_VERSION,
        holdings: [holding, ...state.holdings]
      });
    },
    [commit, state.holdings]
  );

  const removeHolding = useCallback<UsePortfolioApi["removeHolding"]>(
    (id) => {
      commit({
        schemaVersion: SCHEMA_VERSION,
        holdings: state.holdings.filter((h) => h.id !== id)
      });
    },
    [commit, state.holdings]
  );

  const updateHolding = useCallback<UsePortfolioApi["updateHolding"]>(
    (id, patch) => {
      commit({
        schemaVersion: SCHEMA_VERSION,
        holdings: state.holdings.map((h) => (h.id === id ? { ...h, ...patch } : h))
      });
    },
    [commit, state.holdings]
  );

  const clearAll = useCallback(() => commit(EMPTY), [commit]);
  const reload = useCallback(() => setState(readStorage()), []);

  return { hydrated, holdings: state.holdings, addHolding, removeHolding, updateHolding, clearAll, reload };
}
