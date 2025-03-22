import React, { useEffect, useState } from 'react';
import User from '../../components/user/User';
import { useNavigate } from 'react-router-dom';

const UserPage = () => {
    const [teamData, setTeamData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedTeam = localStorage.getItem("teamData");

        if (storedTeam) {
            const parsedTeam = JSON.parse(storedTeam);
            setTeamData(parsedTeam);
            fetchLatestTeamData(parsedTeam.teamNumber);  // Fetch latest on load
            
            // Set up periodic data refresh
            const interval = setInterval(() => {
                fetchLatestTeamData(parsedTeam.teamNumber);
            }, 30000);

            return () => clearInterval(interval); // Cleanup interval
        } else {
            navigate("/login"); // Redirect if no stored data
        }
    }, [navigate]);

    const fetchLatestTeamData = async (teamNumber) => {
        try {
            const response = await fetch(`http://localhost:5000/api/teams/${teamNumber}`);
            if (!response.ok) throw new Error("Failed to fetch team data");

            const updatedData = await response.json();
            setTeamData(updatedData);
            localStorage.setItem("teamData", JSON.stringify(updatedData));  // Update localStorage
        } catch (error) {
            console.error("Error fetching team data:", error);
        }
    };

    return (
        <div>
            <User team={teamData} />
        </div>
    );
};

export default UserPage;
