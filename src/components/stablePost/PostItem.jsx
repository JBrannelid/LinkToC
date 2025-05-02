import React from "react";
import { getProfileImageUrl, formatUserFullName } from "../../utils/userUtils";
import { useAuth } from "../../context/AuthContext";
import PinIcon from "../../assets/icons/PinIcon";
import LoadingSpinner from "../ui/LoadingSpinner";
import { format, parseISO } from "../../utils/calendarUtils";

const PostItem = ({ post }) => {
  const { user, isLoading } = useAuth();

  // If component is still loading auth data
  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <LoadingSpinner size="small" className="text-gray" />
        <p className="ml-2">Laddar...</p>
      </div>
    );
  }

  // Format post date and time
  const formatPostDate = (dateString) => {
    try {
      return format(parseISO(dateString), "yyyy-MM-dd");
    } catch (error) {
      return "Unknown date";
    }
  };

  // Format just the time part of the post date
  const formatPostTime = (dateString) => {
    try {
      return format(parseISO(dateString), "HH:mm");
    } catch (error) {
      return "";
    }
  };

  // Use post author data if available, otherwise fallback to current user
  const displayUser = post.user ? post.user : user;
  const userFullName = formatUserFullName(displayUser) || "Unknown User";
  const profileImageUrl = getProfileImageUrl(displayUser?.profileImage);

  return (
    <div className="bg-background pb-2">
      <div className="flex justify-between">
        <p className="text-sm text-grey opacity-80">
          {/* {formatPostDate(post.date)} */}
        </p>
        <p className="text-xs text-grey opacity-80">
          kl {formatPostTime(post.date)}
        </p>
      </div>
      <div className="bg-white w-full rounded-lg px-3 py-4 mb-4 shadow-lg">
        <div className="flex justify-between pb-4">
          <div className="w-10 h-10 border-1 border-primary rounded-full overflow-hidden mr-4">
            <img
              src={profileImageUrl}
              alt={`Profile image of ${userFullName}`}
              className="w-full h-full object-cover"
            />
          </div>
          {post.isPinned && <PinIcon className="w-6 h-6 text-primary" />}
        </div>
        <h3 className="pb-4">{post.title}</h3>
        <p>{post.content}</p>
        <p className="text-sm text-grey opacity-80 pt-5">{userFullName}</p>
      </div>
    </div>
  );
};

export default PostItem;

// Ask BE för a specific endpoint where we could fetch relevent data such as
/*{
    "isSuccess": true,
    "statusCode": 200,
    "value": {
      "id": 1,
      "title": "Important: New stable rules",
      "content": "Please make sure to clean up after your horse and follow the new scheduling system for arena time.",
      "date": "2025-05-02T00:00:00",
      "isPinned": true
      "user": {
        "id": 1,
        "firstName": "Test",
        "lastName": "Testsson",
        "profileImage": "url/to/image.jpg"
      }
    },
    "message": null
  }
}*/
// A prepare endpoint i stableService: `${ENDPOINTS.STABLEPOST}${stableId}`
