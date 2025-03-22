import React, { useEffect, useState } from "react";

const Master = () => {
  const [teams, setTeams] = useState([]);
  const [selectedAssetNames, setSelectedAssetNames] = useState([]);
  const [reductionPercentage, setReductionPercentage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTeams();
    const interval = setInterval(fetchTeams, 30000); // Auto-refresh
    return () => clearInterval(interval);
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await fetch("https://ieee-wealth-wars-backend.onrender.com/api/teams/all");
      if (!response.ok) throw new Error("Failed to fetch teams");

      const teamsData = await response.json();
      const sortedTeams = teamsData.sort((a, b) => b.valuation - a.valuation);
      setTeams(sortedTeams);
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  };

  const increaseAssets = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://ieee-wealth-wars-backend.onrender.com/api/teams/increase-assets", {
        method: "PUT",
      });

      if (!response.ok) throw new Error("Failed to update assets");

      await fetchTeams();
      alert("All assets increased by 10%");
    } catch (error) {
      console.error("Error increasing assets:", error);
    }
    setLoading(false);
  };

  const handleAssetSelection = (assetName) => {
    setSelectedAssetNames(prev => {
      if (prev.includes(assetName)) {
        return prev.filter(name => name !== assetName);
      } else {
        return prev.length < 10 ? [...prev, assetName] : prev;
      }
    });
  };

  const reduceAssets = async () => {
    if (selectedAssetNames.length !== 10) {
      alert("Please select exactly 10 assets.");
      return;
    }

    const percentage = parseFloat(reductionPercentage);
    if (isNaN(percentage) || percentage <= 0) {
      alert("Please enter a valid percentage.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("https://ieee-wealth-wars-backend.onrender.com/api/teams/reduce-assets", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assetNames: selectedAssetNames, percentage }),
      });

      if (!response.ok) throw new Error("Failed to update assets");

      await fetchTeams();
      alert(`Reduced prices of 10 selected assets by ${percentage}%`);
    } catch (error) {
      console.error("Error reducing asset prices:", error);
    }
    setLoading(false);
    setSelectedAssetNames([]); // Clear selection
    setReductionPercentage(""); // Reset input
  };

  return (
    <div className="max-w-3xl mx-auto mt-6 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-center text-2xl font-bold mb-4">Team Rankings</h2>

      <button
        className="block mx-auto mb-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        onClick={increaseAssets}
        disabled={loading}
      >
        {loading ? "Updating..." : "Increase All Assets by 10%"}
      </button>

      <div className="mb-4 text-center">
        <input
          type="number"
          placeholder="Enter X% Reduction"
          className="border p-2 rounded"
          value={reductionPercentage}
          onChange={(e) => setReductionPercentage(e.target.value)}
        />
        <button
          className="ml-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          onClick={reduceAssets}
          disabled={loading}
        >
          {loading ? "Updating..." : "Reduce Selected Assets"}
        </button>
      </div>

      <h3 className="text-xl font-bold mb-2">Select 10 Assets to Reduce</h3>
      <div className="border p-3 max-h-64 overflow-auto">
        {teams.flatMap(team => team.assets.map(asset => asset.name)).filter((name, index, self) => self.indexOf(name) === index)
          .map(name => (
            <label key={name} className="block">
              <input
                type="checkbox"
                checked={selectedAssetNames.includes(name)}
                onChange={() => handleAssetSelection(name)}
                disabled={!selectedAssetNames.includes(name) && selectedAssetNames.length >= 10}
              />
              <span className="ml-2">{name}</span>
            </label>
          ))}
      </div>

      {teams.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300 mt-4">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="p-3">Rank</th>
              <th className="p-3">Team Name</th>
              <th className="p-3">Valuation (₹)</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team, index) => (
              <tr key={team.teamNumber} className="border-b border-gray-300">
                <td className="p-3 text-center font-semibold">{index + 1}</td>
                <td className="p-3 text-center">{team.teamName}</td>
                <td className="p-3 text-center font-bold text-green-600">₹{team.valuation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center text-gray-500">No teams available</p>
      )}
    </div>
  );
};

export default Master;
