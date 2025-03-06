// PatternDetailPage.tsx
import React from "react";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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

  const navigate = useNavigate();

  const deletePattern = async () => {
    try {
      await axios.delete(`${API_URL}/api/patterns/${patternId}`, {
        withCredentials: true,
      });
      navigate(`/`);
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  const handleDeleteModel = () => {
    setIsDeleteModalOpen(true);
  };

  const closeModal = () => {
    setIsDeleteModalOpen(false);
  };

  useEffect(() => {
    // Jump to the top
    window.scrollTo(0, 0);
  }, []);

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
        <div>
          <Link to={`/patterns/${patternId}/edit`} state={{ currentPattern }}>
            <button>Edit</button>
          </Link>
          <button onClick={handleDeleteModel}>Delete</button>
        </div>
      )}
      {isDeleteModalOpen && (
        <div className="overlay" onClick={closeModal}>
          <div className="overlay-content">
            <div className="deleteModalContent">
              <h3 className="headline">Delete Pattern</h3>
              <p className="mainFont">Are you sure to delete your pattern?</p>
              <button
                className="button buttonAware primaryColor"
                onClick={() => deletePattern()}
              >
                <div className="buttonContentWrapper">
                  <div className="iconWrapper"></div>
                  <span className="buttonFont">Delete</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatternDetailPage;
