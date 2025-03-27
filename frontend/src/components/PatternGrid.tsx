import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Pattern } from "../service/pattern.service";
import HearUnfill from "../assets/icon/HeartUnfill.svg";
import HearFill from "../assets/icon/heartFill.svg";
import { AuthContext } from "../context/auth.context";
import { useLikedPatterns } from "../context/likedPatterns.context";
interface PatternProps {
  patterns: Pattern[];
}

const AllPattern: React.FC<PatternProps> = ({ patterns }) => {
  const authContext = useContext(AuthContext);
  const { likedPatterns, toggleLike, isPatternLiked } = useLikedPatterns();
  const user = authContext?.user;

  const handleLikeClick = (patternId: string, userId: string) => {
    toggleLike(patternId, userId);
  };

  return (
    <div className="patternGrid">
      {patterns.map((pattern) => (
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
              handleLikeClick(pattern.id, user.id);
            }}
          >
            {isPatternLiked(pattern.id) ? (
              <img src={HearFill} alt="heart" />
            ) : (
              <img src={HearUnfill} alt="heart" />
            )}
          </span>
        </div>
      ))}
    </div>
  );
};

export default AllPattern;
