import { useState, useEffect } from "react";
import { eventService } from "../api";
import { ENDPOINTS } from "../api/services/endPoints";

// Constants to make it easy to change endpoints and methods
const DEFAULT_SERVICE = eventService.getAll;
const DEFAULT_ENDPOINT = ENDPOINTS.EVENTS;

function ApiTester() {
  // State for managing API responses and status
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await DEFAULT_SERVICE();
        setData(response);
      } catch (err) {
        console.error("API Error:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">API Tester</h1>
      <p className="mb-2">Testing endpoint: {DEFAULT_ENDPOINT}</p>

      {loading && <p>Loading...</p>}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>Error: {error.message}</p>
          <p>
            Type: {error.type}, Status: {error.status}
          </p>
        </div>
      )}

      {!loading && !error && data && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Response Data:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default ApiTester;
