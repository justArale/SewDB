// PatternDetailPage.tsx
import React from "react";
import { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import { deletePatternImage } from "../service/image.service";
import {
  Pattern,
  getOnePattern,
  deletePattern,
} from "../service/pattern.service";

const PatternDetailPage: React.FC = () => {
  const { patternId } = useParams();
  const [currentPattern, setCurrentPattern] = useState<Pattern | null>(null);
  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (patternId) {
      getOnePattern(patternId).then((patterns) => {
        setCurrentPattern(patterns);
      });
    }
  }, [patternId]);

  const handleDeletePattern = async () => {
    try {
      if (currentPattern?.image) {
        // Delete all images of the pattern
        currentPattern.image.forEach(async (image) => {
          await deletePatternImage(image);
        });
      }

      // Delete the Pattern
      await deletePattern(patternId || "");

      navigate(`/`);
    } catch (error) {
      console.error("Error deleting pattern:", error);
    }
  };

  const handleDeleteModel = () => {
    setIsDeleteModalOpen(true);
  };

  const closeModal = () => {
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="componentBox">
      {currentPattern && (
        <div>
          <h3>Current pattern: {currentPattern.name}</h3>
          <ul>
            <li>Intended for: {currentPattern.intendedFor}</li>
            <li>Sizes: {currentPattern.sizes.join(", ")}</li>
            <li>Category: {currentPattern.category.join(", ")}</li>
            <li>Source: {currentPattern.source.join(", ")}</li>
          </ul>
          {currentPattern.image &&
            currentPattern.image.map((image, index) => (
              <div key={index}>
                <img src={image} alt={currentPattern.name} />
              </div>
            ))}
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
                onClick={() => handleDeletePattern()}
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
