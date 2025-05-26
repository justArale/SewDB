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
import { useAuth } from "./auth.context";

type LikedPatternsContextType = {
  likedPatterns: Pattern[];
  toggleLike: (patternId: string, userId: string) => void;
  isPatternLiked: (patternId: string) => boolean;
};

const LikedPatternsContext = createContext<
  LikedPatternsContextType | undefined
>(undefined);

export const LikedPatternWrapper = ({ children }: { children: ReactNode }) => {
  const [likedPatterns, setLikedPatterns] = useState<Pattern[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchLikedPatterns = async () => {
      if (user && user.id) {
        const likedPatterns = await getUserLikedPattern(user.id);
        setLikedPatterns(likedPatterns);
      }
    };
    fetchLikedPatterns();
  }, [user]);

  const isPatternLiked = (patternId: string) =>
    likedPatterns.some((pattern) => pattern.id == patternId);

  const toggleLike = async (patternId: string, userId: string) => {
    await likeUnlikePattern(patternId, userId);
    if (user && user.id) {
      const likedPatterns = await getUserLikedPattern(user.id);
      setLikedPatterns(likedPatterns);
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

// Custom useLikedPatterns Hook
export const useLikedPatterns = () => {
  const context = useContext(LikedPatternsContext);
  if (!context) {
    throw new Error(
      "useLikedPatterns must be used within a LikedPatternsProvider"
    );
  }
  return context;
};
