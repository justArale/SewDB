import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Pattern } from "../service/pattern.service";
import HearUnfill from "../assets/icon/HeartUnfill.svg";
import HearFill from "../assets/icon/HeartFill.svg";
import { useAuth } from "../context/auth.context";
import { useLikedPatterns } from "../context/likedPatterns.context";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";

const ITEMS_PER_BATCH = import.meta.env.VITE_ITEMS_PER_BATCH;

type PatternProps = {
  patterns: Pattern[];
};

const AllPattern: React.FC<PatternProps> = ({ patterns }) => {
  const { toggleLike, isPatternLiked } = useLikedPatterns();
  const { user } = useAuth();
  const [visibleCount, setVisibleCount] = useState<number>(ITEMS_PER_BATCH);
  const [isLoading, setIsLoading] = useState(false);

  const handleLikeClick = (patternId: string, userId: string) => {
    toggleLike(patternId, userId);
  };

  const loadMore = useCallback(() => {
    if (!isLoading && visibleCount < patterns.length) {
      setIsLoading(true);
      setTimeout(() => {
        setVisibleCount((prev) => prev + ITEMS_PER_BATCH);
        setIsLoading(false);
      }, 800);
    }
  }, [isLoading, visibleCount, patterns.length]);

  const bottomRef = useInfiniteScroll(loadMore);

  const visiblePatterns = patterns.slice(0, visibleCount);

  return (
    <div className="patternGrid">
      {Array.isArray(patterns) &&
        visiblePatterns.map((pattern) => (
          <div key={pattern.id} className="patternCard">
            <Link to={`/patterns/${pattern.id}`} className="noUnderline">
              {pattern.image && (
                <img
                  src={pattern.image[0]}
                  alt={pattern.name}
                  className="patternCardImage"
                />
              )}
              <div className="patternCardContent primaryFontColor">
                <h2 className="labelfont">{pattern.name}</h2>
                <p className="bodyfont">Sizes: {pattern.sizes.join(", ")}</p>
              </div>
            </Link>
            <span
              className="likeIconWrapper"
              onClick={() => {
                if (user?.id && pattern.id) {
                  handleLikeClick(pattern.id, user.id);
                }
              }}
            >
              {pattern.id && isPatternLiked(pattern.id) ? (
                <img src={HearFill} alt="heart" />
              ) : (
                <img src={HearUnfill} alt="heart" />
              )}
            </span>
          </div>
        ))}
      {/* Invisible ref element for scroll detection */}
      <div ref={bottomRef} style={{ height: "1px" }} />
    </div>
  );
};

export default AllPattern;
