import Card from "../ui/card";
import { formatUserFullName, getRoleName } from "../../utils/userUtils";
import ProfileImage from "../common/ProfileImage";

const MemberCard = ({ member, onClick }) => {
  const fullName = formatUserFullName(member);
  const roleName = getRoleName(member.role);

  // Ensure member object has the expected structure for ProfileImage
  const ensuredUser = {
    id: member.userId || member.id,
    firstName: member.firstName || "",
    lastName: member.lastName || "",
    profilePicture:
      member.profilePicture || member.profileImage || member.userProfileImage,
  };

  return (
    <Card.Container className="cursor-pointer" onClick={onClick}>
      <div className="p-2 flex flex-col">
        <div className="flex justify-center">
          <div className="w-24 h-24 mb-2 rounded-full overflow-hidden border-2 border-primary lg:w-full lg:h-30 lg:rounded-md">
            <ProfileImage
              user={ensuredUser}
              className="w-full h-full object-cover"
              alt={`Profile picture of ${fullName}`}
              size="medium"
              fallbackUrl={null}
            />
          </div>
        </div>
        <Card.Title className="text-xs !text-start">{fullName}</Card.Title>
        {roleName && (
          <Card.Subtitle className="text-xs !text-start">
            {roleName}
          </Card.Subtitle>
        )}
      </div>
    </Card.Container>
  );
};

export default MemberCard;
