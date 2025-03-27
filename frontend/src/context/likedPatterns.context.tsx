import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import {
  likeUnlikePattern,
  getUserLikedPattern,
} from "../service/pattern.service";
import { Pattern } from "../service/pattern.service";
import { AuthContext } from "./auth.context";

interface LikedPatternsContextType {
  likedPatterns: Pattern[];
  toggleLike: (patternId: string) => void;
  isPatternLiked: (patternId: string) => boolean;
}

const LikedPatternsContext = createContext<
  LikedPatternsContextType | undefined
>(undefined);

export const LikedPatternWrapper = ({ children }: { children: ReactNode }) => {
  const [likedPatterns, setLikedPatterns] = useState<Pattern[]>([]);
  const authContext = useContext(AuthContext);
  const user = authContext?.user;

  //   useEffect(() => {
  //     const fetchLikedPatterns = async () => {
  //       if (user && user.id) {
  //         const likedPatterns = await getUserLikedPattern(user.id);
  //         setLikedPatterns(likedPatterns);
  //       }
  //     };
  //     fetchLikedPatterns();
  //   }, [likedPatterns]);

  const isPatternLiked = (patternId: string) =>
    likedPatterns.some((pattern) => pattern.id === patternId);

  const toggleLike = async (patternId: string, userId: string) => {
    console.log("toggleLike is clicked");
    likeUnlikePattern(patternId, userId);
    if (isPatternLiked(patternId)) {
      setLikedPatterns(
        likedPatterns.filter((pattern) => pattern.id !== patternId)
      );
    } else {
      setLikedPatterns([...likedPatterns, { id: patternId }]);
    }
  };

  return (
    <LikedPatternsContext.Provider
      value={{ likedPatterns, toggleLike, isPatternLiked }}
    >
      {children}
    </LikedPatternsContext.Provider>
  );
};

// Custom Hook
export const useLikedPatterns = () => {
  const context = useContext(LikedPatternsContext);
  if (!context) {
    throw new Error(
      "useLikedPatterns must be used within a LikedPatternsProvider"
    );
  }
  return context;
};
