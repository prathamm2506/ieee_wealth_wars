import React, { useState } from "react";
import axios from "axios";

const SignUp = () => {
  const [teamNumber, setTeamNumber] = useState("");
  const [teamName, setTeamName] = useState("");
  const [password, setPassword] = useState("");
  const [wallet, setWallet] = useState(0);
  const [assets, setAssets] = useState([
    { name: "", value: 0 },
    { name: "", value: 0 },
    { name: "", value: 0 },
    { name: "", value: 0 },
    { name: "", value: 0 },
  ]);
  const [tenders, setTenders] = useState([
    { name: "", value: 0 },
    { name: "", value: 0 },
  ]);
  const [teamAlliance, setTeamAlliance] = useState("");
  const [message, setMessage] = useState("");

  // Calculate valuation dynamically
  const valuation =
    wallet +
    assets.reduce((sum, asset) => sum + Number(asset.value || 0), 0) +
    tenders.reduce((sum, tender) => sum + Number(tender.value || 0), 0);

  // Update asset fields
  const handleAssetChange = (index, field, value) => {
    const newAssets = [...assets];
    newAssets[index] = { ...newAssets[index], [field]: value };
    setAssets(newAssets);
  };

  // Update tender fields
  const handleTenderChange = (index, field, value) => {
    const newTenders = [...tenders];
    newTenders[index] = { ...newTenders[index], [field]: value };
    setTenders(newTenders);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages

    const teamData = {
      teamNumber,
      teamName,
      password,
      wallet,
      assets,
      tenders,
      allianceName: teamAlliance,
      valuation,
    };

    try {
      const response = await axios.post("http://localhost:5000/api/teams/signup", teamData);
      setMessage(response.data.message);
      
      // Clear the form on successful registration
      setTeamNumber("");
      setTeamName("");
      setPassword("");
      setWallet(0);
      setAssets([
        { name: "", value: 0 },
        { name: "", value: 0 },
        { name: "", value: 0 },
        { name: "", value: 0 },
        { name: "", value: 0 },
      ]);
      setTenders([
        { name: "", value: 0 },
        { name: "", value: 0 },
      ]);
      setTeamAlliance("");
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center mt-10">
      <div className="w-[500px] border rounded bg-white px-7 py-10 shadow-lg">
        <h4 className="text-2xl mb-7 font-semibold">Team SignUp</h4>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Team Number"
            className="input-box w-full p-2 mb-4 border rounded"
            value={teamNumber}
            onChange={(e) => setTeamNumber(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Team Name"
            className="input-box w-full p-2 mb-4 border rounded"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Wallet Amount"
            className="input-box w-full p-2 mb-4 border rounded"
            value={wallet}
            onChange={(e) => setWallet(Number(e.target.value))}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="input-box w-full p-2 mb-4 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <h5 className="font-semibold mb-2">Assets (Optional)</h5>
          {assets.map((asset, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder={`Asset ${index + 1}`}
                className="w-1/2 p-2 border rounded"
                value={asset.name}
                onChange={(e) => handleAssetChange(index, "name", e.target.value)}
              />
              <input
                type="number"
                placeholder="Value"
                className="w-1/2 p-2 border rounded"
                value={asset.value}
                onChange={(e) => handleAssetChange(index, "value", Number(e.target.value))}
              />
            </div>
          ))}

          <h5 className="font-semibold mb-2 mt-4">Tenders (Optional)</h5>
          {tenders.map((tender, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder={`Tender ${index + 1}`}
                className="w-1/2 p-2 border rounded"
                value={tender.name}
                onChange={(e) => handleTenderChange(index, "name", e.target.value)}
              />
              <input
                type="number"
                placeholder="Value"
                className="w-1/2 p-2 border rounded"
                value={tender.value}
                onChange={(e) => handleTenderChange(index, "value", Number(e.target.value))}
              />
            </div>
          ))}

          <input
            type="text"
            placeholder="Team Alliance Name (Optional)"
            className="input-box w-full p-2 mb-4 border rounded"
            value={teamAlliance}
            onChange={(e) => setTeamAlliance(e.target.value)}
          />

          <div className="mb-4 font-semibold">Total Valuation: ₹{valuation}</div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Register Team
          </button>

          {/* Success/Error Message */}
          {message && <p className="mt-4 text-center text-sm text-gray-700">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default SignUp;
