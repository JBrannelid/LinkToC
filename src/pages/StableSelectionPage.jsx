import React from "react";
import { useNavigate } from "react-router";
import { useAppContext } from "../context/AppContext";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import useStableData from "../hooks/useStableData";
import { useLoadingState } from "../hooks/useLoadingState";

const StableSelectionPage = () => {
  const { changeStable } = useAppContext();
  const navigate = useNavigate();
  const {
    stables,
    status: { loading, error },
  } = useStableData();

  const loadingState = useLoadingState(loading, "fetch");

  const handleSelectStable = (stableId, stableName) => {
    changeStable(stableId, stableName);
    navigate("/home");
  };

  if (loading)
    return (
      <div className="flex items-center justify-center p-4">
        <LoadingSpinner size="medium" className="text-gray" />
        <p>{loadingState.getMessage()}</p>
      </div>
    );

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 text-red-700">
        Ett fel uppstod vid hämtning av stall: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Välj ett stall</h1>

      {stables.length === 0 ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <p>Inga stallar tillgängliga</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stables.map(({ id, name, location }) => (
            <div
              key={id}
              className="border rounded-lg shadow-md p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => handleSelectStable(id, name)}
            >
              <h2 className="text-lg font-semibold">{name}</h2>
              {location && <p className="text-gray-600">{location}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StableSelectionPage;
