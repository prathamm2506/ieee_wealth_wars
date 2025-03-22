import React, { useState, useEffect } from 'react';
import DisplayCard from '../../components/card/DisplayCard';

const Dashboard = () => {
    const [teams, setTeams] = useState([]);
    const [filteredTeams, setFilteredTeams] = useState([]); // Stores search results
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTeams = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/teams/all");
            if (!response.ok) {
                throw new Error("Failed to fetch teams");
            }
            const data = await response.json();
            setTeams(data);
            filterTeams(data); // Apply filtering after fetching
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const filterTeams = (teamsData) => {
        if (searchQuery.trim() === "") {
            setFilteredTeams(teamsData); // Reset to full list if search is empty
        } else {
            const filtered = teamsData.filter(team =>
                team.teamNumber.toString().includes(searchQuery) // Match team number
            );
            setFilteredTeams(filtered);
        }
    };

    useEffect(() => {
        fetchTeams();

        const interval = setInterval(() => {
            fetchTeams();
        }, 30000); // Auto-refresh every 30 seconds

        return () => clearInterval(interval);
    }, []); // Initial fetch when the component mounts

    // Search function
    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        filterTeams(teams); // Reapply the filter with updated search query
    };
    useEffect(() => {
      const fetchAndUpdateTeams = async () => {
          try {
              const response = await fetch("http://localhost:5000/api/teams/all");
              if (!response.ok) {
                  throw new Error("Failed to fetch teams");
              }
              const data = await response.json();
              setTeams(data);
              filterTeams(data); // Apply filtering after fetching
          } catch (error) {
              setError(error.message);
          } finally {
              setLoading(false);
          }
      };
  
      const filterTeams = (teamsData) => {
          if (searchQuery.trim() === "") {
              setFilteredTeams(teamsData); // Reset to full list if search is empty
          } else {
              const filtered = teamsData.filter(team =>
                  team.teamNumber.toString().includes(searchQuery) // Match team number
              );
              setFilteredTeams(filtered);
          }
      };
  
      fetchAndUpdateTeams();
  
      const interval = setInterval(() => {
          fetchAndUpdateTeams();
      }, 30000); // Auto-refresh every 30 seconds
  
      return () => clearInterval(interval);
  }, [searchQuery]); // Adding searchQuery as a dependency
  

    return (
        <div>
            {/* Search Input */}
            <div className='flex flex-row items-center justify-center mt-10'>
                <input
                    type="text"
                    placeholder="Search by Team Number"
                    value={searchQuery}
                    onChange={handleSearch}
                    className="border p-2 rounded-lg w-1/3 mb-4"
                />
            </div>

            {loading ? (
                <p>Loading teams...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <DisplayCard teams={filteredTeams} onUpdate={fetchTeams} />
            )}
        </div>
    );
};

export default Dashboard;
