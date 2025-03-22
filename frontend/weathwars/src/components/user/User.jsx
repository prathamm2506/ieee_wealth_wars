import React from "react";

const User = ({ team }) => {
  if (!team) {
    return <p className="text-center text-red-500">No team data available</p>;
  }

  const { teamNumber, teamName, wallet, assets, tenders, allianceName, valuation } = team;

  return (
    <div className="max-w-md mx-auto bg-blue-100 p-6 rounded-2xl shadow-lg">
      <h2 className="text-center text-lg font-semibold">Team Details</h2>

      <div className="text-center">
        <p className="text-gray-500 text-sm">Team Number</p>
        <h1 className="text-xl font-bold">{teamNumber}</h1>

        <p className="text-gray-500 text-sm mt-2">Team Name</p>
        <h1 className="text-xl font-bold">{teamName}</h1>

        <p className="text-gray-500 text-sm mt-2">Total Valuation</p>
        <h1 className="text-2xl font-bold">₹{valuation}</h1>
      </div>

      <div className="flex justify-center gap-4 my-4">
        <div className="bg-gray-900 text-white py-2 px-4 rounded-lg text-center">
          <p className="text-lg font-semibold">₹{wallet}</p>
          <p className="text-sm">Wallet</p>
        </div>
      </div>

      <h3 className="text-center font-semibold">Assets</h3>
      <div className="space-y-2 mt-2">
        {assets.length > 0 ? (
          assets.map((asset, index) => (
            <div key={index} className="flex justify-between items-center bg-white p-3 rounded-lg shadow-md">
              <p>{asset.name || "Unnamed Asset"}</p>
              <p className="font-semibold text-green-600">₹{asset.value}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm text-center">No assets assigned</p>
        )}
      </div>

      <h3 className="text-center font-semibold mt-4">Tenders</h3>
      <div className="space-y-2 mt-2">
        {tenders.length > 0 ? (
          tenders.map((tender, index) => (
            <div key={index} className="flex justify-between items-center bg-white p-3 rounded-lg shadow-md">
              <p>{tender.name || "Unnamed Tender"}</p>
              <p className="font-semibold text-blue-600">₹{tender.value}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm text-center">No tenders assigned</p>
        )}
      </div>

      {allianceName ? (
        <div className="text-center mt-4">
          <p className="text-gray-500 text-sm">Alliance</p>
          <h1 className="text-lg font-bold">{allianceName}</h1>
        </div>
      ) : (
        <p className="text-gray-500 text-sm text-center">No alliance assigned</p>
      )}
    </div>
  );
};

export default User;
