import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { fetchEnquiries, fetchReviews } from "../api";

const CountsContext = createContext({ counts: {}, refreshCounts: () => {} });

const EMPTY = { enquiries: 0, reviews: 0 };

/**
 * Counts of items still needing attention, shown as badges in the sidebar.
 * Kept above the router so navigating between pages does not refetch them —
 * pages call refreshCounts() after they change something instead.
 */
export function CountsProvider({ children }) {
  const { admin } = useAuth();
  const [counts, setCounts] = useState(EMPTY);

  const refreshCounts = useCallback(async () => {
    if (!admin) {
      setCounts(EMPTY);
      return;
    }
    try {
      const [enquiries, reviews] = await Promise.all([fetchEnquiries(), fetchReviews()]);
      setCounts({
        enquiries: enquiries.filter((e) => e.status === "New").length,
        reviews: reviews.filter((r) => !r.visible).length,
      });
    } catch {
      // A badge is not worth surfacing an error for — the page itself will
      // report the failure when its own request fails.
      setCounts(EMPTY);
    }
  }, [admin]);

  useEffect(() => {
    refreshCounts();
  }, [refreshCounts]);

  return (
    <CountsContext.Provider value={{ counts, refreshCounts }}>
      {children}
    </CountsContext.Provider>
  );
}

export function useCounts() {
  return useContext(CountsContext);
}
