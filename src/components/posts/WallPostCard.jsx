import PinIcon from "../../assets/icons/PinIcon";
import ChevronDownIcon from "../../assets/icons/ChevronDownIcon";

const WallPostCard = ({
  title,
  children,
  isExpanded,
  toggleExpand,
  actions,
  form,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm md:shadow overflow-hidden border border-gray-100 md:border-gray-200">
      <div
        className="p-4 flex items-center cursor-pointer"
        onClick={toggleExpand}
        aria-label="Expandable important message"
      >
        <PinIcon className="w-6 h-6 text-primary" />

        <p className="flex-1 pl-1 xl:text-xl md:text-lg">{title}</p>

        <div className="text-primary">
          <ChevronDownIcon
            className={`w-5 h-5 transition-transform md:w-5.5 md:h-5.5 lg:w-6 lg:h-6 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>
      {/* Expandable content */}
      {isExpanded && (
        <div className="px-4 pb-4">
          {children}
          {actions && <div className="mt-3"> {actions}</div>}
          {form && <div className="mt-5">{form}</div>}
        </div>
      )}
    </div>
  );
};

export default WallPostCard;
