import React, { useState } from "react";
import Select from "react-select";

const assetOptions = [
  "Branch Offices", "ATMs", "Data Centers", "Government Bonds", "Corporate Loans", "Mortgage Portfolios",
  "Cloud Servers (AWS, Azure, GCP)", "On-Premise Data Center", "Networking Equipment", "Cybersecurity Suite",
  "AI & Data Scientists", "Hospitals", "Medical Laboratories", "MRI Machines", "Electronic Health Record (EHR) Systems",
  "Telemedicine Platforms", "Commercial Buildings", "Residential Apartments", "Shopping Malls", "Industrial Warehouses",
  "Co-Working Spaces", "Power Plants", "Solar Farms", "Electric Vehicle Charging Stations", "Smart Grid Infrastructure",
  "Battery Storage Systems","None","AI-Powered Customer Service Assistant", "Robotic Process Automation Systems", "Biometric Authentication Platform", "Cloud-based Core Banking System", "Quantum Computing integration platform", "Blockchain based security system", "Edge computing infra", "Adaptive cybersecurity system with AI","Human digitl twin system", "AR surgical navigation system", "AI powered drug discovery platform", "Blockchain health data exchange system", "AR Property showcase","Automated property management platform","AI Powered property valuation platform", "Blockchain-based property transaction platform", "Green hydrogen production and Distribution facility","Fusion Energy Pilot Plants","Advanced energy storage system","AI Driven Energy Management Platform"
].map(asset => ({ label: asset, value: asset }));

const DisplayCard = ({ teams, onUpdate }) => {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openEditModal = (team) => {
    setSelectedTeam({ ...team });
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedTeam((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAssetChange = (selectedOption, index) => {
    setSelectedTeam((prev) => {
      const updatedAssets = [...prev.assets];
      updatedAssets[index] = { ...updatedAssets[index], name: selectedOption.value };
      return { ...prev, assets: updatedAssets };
    });
  };

  const handleValueChange = (e, index) => {
    const { value } = e.target;
    setSelectedTeam((prev) => {
      const updatedAssets = [...prev.assets];
      updatedAssets[index] = { ...updatedAssets[index], value: value };
      return { ...prev, assets: updatedAssets };
    });
  };

  const handleNestedChange = (e, index, type) => {
    const { name, value } = e.target;
    setSelectedTeam((prev) => {
      const updatedItems = [...prev[type]];
      updatedItems[index] = { ...updatedItems[index], [name]: value };
      return { ...prev, [type]: updatedItems };
    });
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`https://ieee-wealth-wars-backend.onrender.com/api/teams/edit/${selectedTeam.teamNumber}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wallet: selectedTeam.wallet,
          assets: selectedTeam.assets,
          tenders: selectedTeam.tenders,
          allianceName: selectedTeam.allianceName
        }),
      });

      if (!response.ok) throw new Error("Failed to update team");

      onUpdate();
      closeModal();
    } catch (error) {
      console.error(error);
      alert("Error updating team!");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTeam(null);
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-center text-2xl font-bold mb-4">All Teams</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <div key={team._id} className="bg-white p-5 rounded-lg shadow-md border">
            <div className="flex justify-between">
              <h3 className="text-xl font-bold text-gray-800">
                {team.teamName}
              </h3>
              <span className="text-gray-600">#{team.teamNumber}</span>
            </div>

            <div className="flex justify-between mt-2">
              <p className="text-gray-700"><strong>Wallet:</strong> ₹{team.wallet}</p>
              <p className="text-gray-700"><strong>Alliance:</strong> {team.allianceName || "None"}</p>
            </div>

            <p className="text-gray-700 mt-2"><strong>Valuation:</strong> ₹{team.valuation}</p>

            {team.assets?.length > 0 && (
              <div className="mt-3">
                <h4 className="text-lg font-semibold text-gray-800">Assets</h4>
                {team.assets.map((asset, index) => (
                  <p key={index} className="text-gray-600">
                    <strong>Asset {index + 1}:</strong> {asset.name} (₹{asset.value})
                  </p>
                ))}
              </div>
            )}

            {team.tenders?.length > 0 && (
              <div className="mt-3">
                <h4 className="text-lg font-semibold text-gray-800">Tenders</h4>
                {team.tenders.map((tender, index) => (
                  <p key={index} className="text-gray-600">
                    <strong>Tender {index + 1}:</strong> {tender.name} (₹{tender.value})
                  </p>
                ))}
              </div>
            )}

            <button
              onClick={() => openEditModal(team)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
            >
              Edit
            </button>
          </div>
        ))}
      </div>

      {isModalOpen && selectedTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Edit Team</h2>
            <form>
              <div className="flex gap-2">
                <div className="w-1/2">
                  <label className="block text-sm font-semibold">Team Number</label>
                  <input type="text" value={selectedTeam.teamNumber} className="w-full p-2 mb-2 border rounded" disabled />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-semibold">Team Name</label>
                  <input type="text" name="teamName" value={selectedTeam.teamName} onChange={handleChange} className="w-full p-2 mb-2 border rounded" />
                </div>
              </div>

              <div className="flex gap-2">
                <div className="w-1/2">
                  <label className="block text-sm font-semibold">Wallet</label>
                  <input type="number" name="wallet" value={selectedTeam.wallet} onChange={handleChange} className="w-full p-2 mb-2 border rounded" />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-semibold">Alliance Name</label>
                  <input type="text" name="allianceName" value={selectedTeam.allianceName || ""} onChange={handleChange} className="w-full p-2 mb-2 border rounded" />
                </div>
              </div>

              {selectedTeam.assets?.length > 0 && (
                <>
                  <h4 className="text-lg font-semibold mt-3">Assets</h4>
                  {selectedTeam.assets.map((asset, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Select
                        options={assetOptions}
                        value={assetOptions.find((opt) => opt.value === asset.name)}
                        onChange={(selectedOption) => handleAssetChange(selectedOption, index)}
                        className="w-1/2"
                      />
                      <input
                        type="number"
                        value={asset.value}
                        onChange={(e) => handleValueChange(e, index)}
                        className="w-1/2 p-2 border rounded"
                        placeholder="Value"
                      />
                    </div>
                  ))}
                </>
              )}

              {selectedTeam.tenders?.length > 0 && (
                <>
                  <h4 className="text-lg font-semibold mt-3">Tenders</h4>
                  {selectedTeam.tenders.map((tender, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input type="text" name="name" value={tender.name} onChange={(e) => handleNestedChange(e, index, "tenders")} className="w-1/2 p-2 border rounded" placeholder="Tender Name" />
                      <input type="number" name="value" value={tender.value} onChange={(e) => handleNestedChange(e, index, "tenders")} className="w-1/2 p-2 border rounded" placeholder="Value" />
                    </div>
                  ))}
                </>
              )}

              <div className="flex justify-between mt-4">
                <button type="button" onClick={closeModal} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700">Cancel</button>
                <button type="button" onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisplayCard;
