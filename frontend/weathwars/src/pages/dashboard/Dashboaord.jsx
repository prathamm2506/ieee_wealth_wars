import React, { useState, useEffect } from 'react';
import DisplayCard from '../../components/card/DisplayCard';

const Dashboard = () => {
    const [teams, setTeams] = useState([]);
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
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeams();
    }, []);

    return (
        <div>
            {loading ? (
                <p>Loading teams...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <DisplayCard teams={teams} onUpdate={fetchTeams} />
            )}
        </div>
    );
};

export default Dashboard;
