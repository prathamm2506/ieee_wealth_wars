import React, { useState } from "react";

const DisplayCard = ({ teams, onUpdate }) => {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Open modal and clone team data for editing
  const openEditModal = (team) => {
    setSelectedTeam({ ...team });
    setIsModalOpen(true);
  };

  // Handle input changes in the modal
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedTeam((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle asset and tender updates
  const handleNestedChange = (e, index, type) => {
    const { name, value } = e.target;
    setSelectedTeam((prev) => {
      const updatedItems = [...prev[type]];
      updatedItems[index] = { ...updatedItems[index], [name]: value };
      return { ...prev, [type]: updatedItems };
    });
  };

  // Save updated data to backend
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

        onUpdate(); // Refresh data in the parent component
        closeModal();
    } catch (error) {
        console.error(error);
        alert("Error updating team!");
    }
};


  // Close modal
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
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {team.teamName} (#{team.teamNumber})
            </h3>
            <p className="text-gray-700"><strong>Wallet:</strong> ₹{team.wallet}</p>
            <p className="text-gray-700"><strong>Valuation:</strong> ₹{team.valuation}</p>
            <p className="text-gray-700"><strong>Alliance:</strong> {team.allianceName || "None"}</p>

            {/* Assets Section */}
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

            {/* Tenders Section */}
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

      {/* Edit Team Modal */}
      {isModalOpen && selectedTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Team</h2>
            <form>
              <label className="block text-sm font-semibold">Team Number</label>
              <input type="text" value={selectedTeam.teamNumber} className="w-full p-2 mb-2 border rounded" disabled />

              <label className="block text-sm font-semibold">Team Name</label>
              <input type="text" name="teamName" value={selectedTeam.teamName} onChange={handleChange} className="w-full p-2 mb-2 border rounded" />

              <label className="block text-sm font-semibold">Wallet</label>
              <input type="number" name="wallet" value={selectedTeam.wallet} onChange={handleChange} className="w-full p-2 mb-2 border rounded" />

              <label className="block text-sm font-semibold">Alliance Name</label>
              <input type="text" name="teamAlliance" value={selectedTeam.allianceName || ""} onChange={handleChange} className="w-full p-2 mb-2 border rounded" />

              {/* Editable Assets */}
              {selectedTeam.assets?.length > 0 && (
                <>
                  <h4 className="text-lg font-semibold mt-3">Assets</h4>
                  {selectedTeam.assets.map((asset, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input type="text" name="name" value={asset.name} onChange={(e) => handleNestedChange(e, index, "assets")} className="w-1/2 p-2 border rounded" placeholder="Asset Name" />
                      <input type="number" name="value" value={asset.value} onChange={(e) => handleNestedChange(e, index, "assets")} className="w-1/2 p-2 border rounded" placeholder="Value" />
                    </div>
                  ))}
                </>
              )}

              {/* Editable Tenders */}
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
