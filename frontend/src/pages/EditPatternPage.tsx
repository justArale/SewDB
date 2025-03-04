import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AddPattern from "../components/AddPattern";

const API_URL = import.meta.env.VITE_API_URL;

const PatternEditPage: React.FC = () => {
  const { patternId } = useParams();
  const [currentPattern, setCurrentPattern] = useState();

  const fetchPatternData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/patterns/${patternId}`, {
        withCredentials: true,
      });
      setCurrentPattern(response.data);
    } catch (error) {
      console.error("Error fetching the pattern data: ", error);
    }
  };

  useEffect(() => {
    fetchPatternData();
  }, []);

  return (
    <div>
      <AddPattern existingPattern={currentPattern} />
    </div>
  );
};

export default PatternEditPage;
