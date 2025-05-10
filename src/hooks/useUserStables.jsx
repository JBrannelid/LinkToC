import { useState, useEffect, useCallback } from "react";
import stableService from "../api/services/stableService";
import { useLoadingState } from "./useLoadingState";
import { useAuth } from "../context/AuthContext";
import userService from "../api/services/userService";

export function useUserStables() {
  const [userStables, setUserStables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [operationType, setOperationType] = useState("fetch");
  const { user } = useAuth();

  const fetchUserStables = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    setOperationType("fetch");
    try {
      setLoading(true);
      setError(null);

      const userStablesData = await userService.getUserStables(user.id);

      // Hämta fullständig information för varje stall
      const stableResponse = userStablesData.map(async (stableRelation) => {
        try {
          const response = await stableService.getById(
            stableRelation.stableIdFk
          );
          return {
            ...response.value,
            userRole: stableRelation.role,
          };
        } catch (error) {
          console.error(
            `Failed to fetch stable ${stableRelation.stableIdFk}:`,
            error
          );
          return null;
        }
      });

      const stableDetails = await Promise.all(stableResponse);
      setUserStables(stableDetails.filter((stable) => stable !== null));
    } catch (error) {
      setError(error.message || "Failed to retrieve user stables");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchUserStables();
  }, [fetchUserStables]);

  const loadingState = useLoadingState(loading, operationType);

  return {
    stables: userStables,
    loading,
    error,
    loadingState,
    refetch: fetchUserStables,
  };
}

export default useUserStables;
