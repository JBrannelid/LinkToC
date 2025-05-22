import Card from "../ui/card";
import { formatUserFullName, getRoleName } from "../../utils/userUtils";
import ProfileImage from "../common/ProfileImage";

const MemberCard = ({ member, onClick }) => {
  const fullName = formatUserFullName(member);
  const roleName = getRoleName(member.role);

  const validatedUser = {
    id: member.userId || member.id,
    firstName: member.firstName || "",
    lastName: member.lastName || "",
    profilePicture: member.profilePicture,
  };

  return (
    <Card.Container className="cursor-pointer" onClick={onClick}>
      <div className="p-2 flex flex-col bg-gradient-to-b from-primary-light to-white">
        <div className="flex justify-center bg-background ">
          <div className="w-full h-25 mb-2 rounded-xl overflow-hidden border-2 border-primary lg:w-full lg:h-40 xl:h-45 ">
            <ProfileImage
              user={validatedUser}
              className="w-30 h-30 lg:h-50 lg:w-50 lg:aspect-ratio mx-auto"
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
