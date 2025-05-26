import { formatUserFullName, getRoleName } from "../../utils/userUtils";
import ProfileImage from "../common/ProfileImage";
import CardContainer from "../ui/card/CardContainer";
import CardSubtitle from "../ui/card/CardSubtitle";
import CardTitle from "../ui/card/CardTitle";

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
    <CardContainer className="cursor-pointer" onClick={onClick}>
      <div className="p-2 flex flex-col bg-gradient-to-b from-primary-light to-white">
        <div className="flex justify-center bg-background ">
          <div className="w-full h-25 mb-2 rounded-xl overflow-hidden border-2 border-primary lg:h-40 xl:h-45 ">
            <ProfileImage
              user={validatedUser}
              className="w-full h-30 lg:h-50 lg:aspect-ratio mx-auto"
              alt={`Profile picture of ${fullName}`}
              size="small"
              fallbackUrl={null}
            />
          </div>
        </div>
        <CardTitle className="text-xs !text-start">{fullName}</CardTitle>
        {roleName && (
          <CardSubtitle className="text-xs !text-start">
            {roleName}
          </CardSubtitle>
        )}
      </div>
    </CardContainer>
  );
};

export default MemberCard;
