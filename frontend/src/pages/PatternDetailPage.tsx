// PatternDetailPage.tsx
import React from "react";
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth.context";
import { useLikedPatterns } from "../context/likedPatterns.context";
import { deletePatternImage } from "../service/image.service";
import {
  Pattern,
  getOnePattern,
  deletePattern,
} from "../service/pattern.service";
import HearUnfill from "../assets/icon/HeartUnfill.svg";
import HearFill from "../assets/icon/HeartFill.svg";

const PatternDetailPage: React.FC = () => {
  const { patternId } = useParams();
  const [currentPattern, setCurrentPattern] = useState<Pattern | null>(null);
  const { user } = useAuth();
  const { toggleLike, isPatternLiked } = useLikedPatterns();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const navigate = useNavigate();

  const handleLikeClick = (patternId: string, userId: string) => {
    toggleLike(patternId, userId);
  };

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
            <span
              className="likeIconWrapper"
              onClick={() => {
                if (user?.id && patternId) {
                  handleLikeClick(patternId, user.id);
                }
              }}
            >
              {patternId && isPatternLiked(patternId) ? (
                <img src={HearFill} alt="heart" />
              ) : (
                <img src={HearUnfill} alt="heart" />
              )}
            </span>
          </div>

          <ul className="patternContentWrapper">
            <li>
              <span></span>
              <div>
                <h5 className="labelfont">Name:</h5>
                <p className="bodyfont patternContent">{currentPattern.name}</p>
              </div>
            </li>
            <li>
              <span></span>
              <div>
                <h5 className="labelfont">Intended for:</h5>
                <p className="bodyfont patternContent">
                  {currentPattern.intendedFor.join(",")}
                </p>
              </div>
            </li>
            <li>
              <span></span>

              <div>
                <h5 className="labelfont">Category:</h5>
                <p className="bodyfont patternContent">
                  {currentPattern.category.join(", ")}
                </p>
              </div>
            </li>
            <li>
              <span></span>

              <div>
                <h5 className="labelfont">Sizes:</h5>
                <p className="bodyfont patternContent">
                  {currentPattern.sizes.join(", ")}
                </p>
              </div>
            </li>
            <li>
              <span></span>

              <div>
                <h5 className="labelfont">Source:</h5>
                <p className="bodyfont patternContent">
                  {currentPattern.source.join(", ")}
                </p>
              </div>
            </li>
          </ul>
        </div>
      )}
      {user?.isAdmin && (
        <div className="buttonWrapper">
          <Link to={`/patterns/${patternId}/edit`} state={{ currentPattern }}>
            <button className="buttonAction">Edit</button>
          </Link>
          <button onClick={handleDeleteModel} className="buttonAware">
            Delete
          </button>
        </div>
      )}
      {isDeleteModalOpen && (
        <div className="overlay" onClick={closeModal}>
          <div className="overlay-content">
            <div className="deleteModalContent">
              <h3 className="bodyfontLarge">Delete Pattern</h3>
              <p className="bodyfont">Are you sure to delete your pattern?</p>
              <button
                className="button buttonAware primaryColor"
                onClick={() => handleDeletePattern()}
              >
                <div className="innerButtonWrapper"></div>
                <span className="labelfont">Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatternDetailPage;
