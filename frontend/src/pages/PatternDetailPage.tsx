// PatternDetailPage.tsx
import React from "react";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

const API_URL = import.meta.env.VITE_API_URL;

interface Pattern {
  name: string;
  image: string;
  intendedFor: string;
  sizes: [];
  category: [];
  source: [];
}

const PatternDetailPage: React.FC = () => {
  const { patternId } = useParams();
  const [currentPattern, setCurrentPattern] = useState<Pattern | null>(null);
  const authContext = useContext(AuthContext);
  const user = authContext?.user;

  const fetchPatternData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/patterns/${patternId}`, {
        withCredentials: true,
      });
      setCurrentPattern(response.data.patterns);
    } catch (error) {
      console.error("Error fetching the pattern data: ", error);
    }
  };

  useEffect(() => {
    fetchPatternData();
  }, [patternId]);

  return (
    <div>
      {currentPattern && (
        <div>
          <h3>Current pattern: {currentPattern.name}</h3>
          <ul>
            <li>Intended for: {currentPattern.intendedFor}</li>
            <li>Sizes: {currentPattern.sizes.join(", ")}</li>
            <li>Category: {currentPattern.category.join(", ")}</li>
            <li>Source: {currentPattern.source.join(", ")}</li>
          </ul>
          {currentPattern.image && (
            <img src={currentPattern.image} alt={currentPattern.name} />
          )}
        </div>
      )}
      {user?.isAdmin && (
        <Link to={`/patterns/${patternId}/edit`} state={{ currentPattern }}>
          <button>Edit</button>
        </Link>
      )}
    </div>
  );
};

export default PatternDetailPage;
