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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  // Bildwechsel bei Dot-Klick
  const handleDotClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Wischbewegung für mobiles Swipen
  let touchStartX = 0;
  let touchEndX = 0;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX - touchEndX > 50) {
      // Wischen nach links (nächstes Bild)
      setCurrentImageIndex((prevIndex) =>
        prevIndex < (currentPattern?.image?.length || 1) - 1 ? prevIndex + 1 : 0
      );
    } else if (touchEndX - touchStartX > 50) {
      // Wischen nach rechts (vorheriges Bild)
      setCurrentImageIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : (currentPattern?.image?.length || 1) - 1
      );
    }
  };

  return (
    <div className="componentBox">
      {currentPattern && (
        <div className="patternDetailRow">
          <div className="imageWrapper">
            {currentPattern.image &&
              currentPattern.image.map((image, index) => (
                <div
                  key={index}
                  className={`imageCarousel ${
                    index === currentImageIndex ? "active" : ""
                  }`}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  {index === currentImageIndex && (
                    <img
                      src={image}
                      alt={currentPattern.name}
                      className="patternImage"
                    />
                  )}
                </div>
              ))}
            <div className="dotsWrapper">
              {currentPattern?.image?.map((_, index) => (
                <span
                  key={index}
                  className={`dot ${
                    index === currentImageIndex ? "active" : ""
                  }`}
                  onClick={() => handleDotClick(index)}
                ></span>
              ))}
            </div>
          </div>

          <ul className="patternContentWrapper">
            <li>
              <h5 className="labelfont">Name:</h5>
              <p className="bodyfont">{currentPattern.name}</p>
            </li>
            <li>
              <h5 className="labelfont">Intended for:</h5>
              <p className="bodyfont">{currentPattern.intendedFor}</p>
            </li>
            <li>
              <h5 className="labelfont">Category:</h5>
              <p className="bodyfont">{currentPattern.category.join(", ")}</p>
            </li>
            <li>
              <h5 className="labelfont">Sizes:</h5>
              <p className="bodyfont">{currentPattern.sizes.join(", ")}</p>
            </li>
            <li>
              <h5 className="labelfont">Source:</h5>
              <p className="bodyfont">{currentPattern.source.join(", ")}</p>
            </li>
          </ul>
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
