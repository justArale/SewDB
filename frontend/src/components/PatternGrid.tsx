import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Pattern } from "../service/pattern.service";
import HearUnfill from "../assets/icon/HeartUnfill.svg";
import HearFill from "../assets/icon/heartFill.svg";
import { likeUnlikePattern } from "../service/pattern.service";
import { AuthContext } from "../context/auth.context";
import { User } from "../service/user.service";

interface PatternProps {
  patterns: Pattern[];
}

const AllPattern: React.FC<PatternProps> = ({ patterns }) => {
  const authContext = useContext(AuthContext);
  const user: User | null = authContext?.user ?? null;
  const [like, setLike] = useState<boolean>(false);

  const likeUnlike = async (patternId: string, userId: string) => {
    console.log("likeUnlikePattern is clicked");
    setLike((prevLike) => !prevLike);
    console.log(like);
    likeUnlikePattern(patternId, userId);
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
              if (pattern?.id && user?.id) {
                likeUnlike(pattern.id, user.id);
              } else {
                console.error("Pattern ID or User ID is undefined");
              }
            }}
          >
            {like ? (
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
