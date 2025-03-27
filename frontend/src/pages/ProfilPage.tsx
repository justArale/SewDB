import React from "react";
import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import UserLikedPatterns from "../components/UserLikedPatterns";
import { AuthContext } from "../context/auth.context";
import { useContext } from "react";
import {
  User,
  getSingleUser,
  deleteUser,
  logoutUser,
} from "../service/user.service";
// import { Pattern, getUserLikedPattern } from "../service/pattern.service";
import { Edit } from "@just1arale/icons";
import { Delete } from "@just1arale/icons";
import UserInfoCard from "../components/UserInfoCard";
import { useLikedPatterns } from "../context/likedPatterns.context";

const ProfilPage: React.FC = () => {
  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  const { userId } = useParams();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  // const [currentUserLikedPatterns, setCurrentUserLikedPatterns] = useState<
  //   Pattern[] | []
  // >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { likedPatterns } = useLikedPatterns();

  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) return;

    const fetchUserData = async () => {
      try {
        const userData = await getSingleUser(userId);
        setCurrentUser(userData);

        // const userLikedPatterns = await getUserLikedPattern(userId);
        // setCurrentUserLikedPatterns(userLikedPatterns || []);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId);
      await logoutUser();
      navigate(`/`);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleDeleteModel = () => {
    setIsDeleteModalOpen(true);
  };

  const closeModal = () => {
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="profilPageWrapper">
      {currentUser && (
        <div className="componentBox">
          {isLoading ? (
            <div className="skeleton skeletonUserInfoBox"></div>
          ) : (
            <UserInfoCard user={currentUser} />
          )}

          {user && userId === String(user.id) && (
            <div className="buttonWrapper">
              <Link to={`/user/${userId}/edit`} className="">
                <button className="buttonAction">
                  {" "}
                  <div className="innerButtonWrapper">
                    <Edit width="16" height="16" />

                    <span className="">Edit</span>
                  </div>
                </button>
              </Link>

              <button className="buttonAware" onClick={handleDeleteModel}>
                <div className="innerButtonWrapper">
                  <Delete width="16" height="16" />

                  <span className="">Delete</span>
                </div>
              </button>
            </div>
          )}
          {likedPatterns && <UserLikedPatterns likedPatterns={likedPatterns} />}
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="overlay" onClick={closeModal}>
          <div className="overlay-content">
            <div className="deleteModalContent">
              <h3 className="bodyfontLarge">Delete Profil</h3>
              <p className="bodyfont">Are you sure to delete your profil?</p>
              <button
                className="button buttonAware primaryColor"
                onClick={() => handleDeleteUser(userId || "")}
              >
                <div className="innerButtonWrapper">
                  <Delete width="16" height="16" />

                  <span className="labelfont">Delete</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilPage;
