// Default horse profile state with all expected properties

export const defaultHorseProfile = {
  // General info
  name: "",
  breed: "",
  age: "",
  color: "",
  height: "",
  weight: "",
  gender: "",
  birthDate: "",
  discipline: "",
  bio: "",
  parents: "",

  // Ownership info
  owner: "",
  purchaseDate: "",
  registryOrganization: "",
  registrationNumber: "",
  microchipId: "",

  // Health info
  healthStatus: "",
  lastVetExam: "",
  vaccinations: [],
  dentalRecords: [],
  veterinarian: {
    name: "",
    practice: "",
    contact: "",
  },

  // Feeding
  feedType: "",
  feedAmount: "",
  specialDiet: "",
  supplements: [],
  feedingNotes: "",
  feedingSchedule: [],

  // Insurance

  insurance: {
    provider: "",
    policyNumber: "",
    expirationDate: "",
    coverageType: "",
    policyStatus: "",
    policyNotes: "",
  },

  // Other properties
  documents: {},
};

// Helper function to merge horse data with defaults
export function createHorseProfile(horseData) {
  return { ...defaultHorseProfile, ...horseData };
}

// Utility for displaying horse metadata in a consistent format
export function formatHorseMetadata(horse) {
  return [horse.breed, horse.discipline].filter(Boolean).join(" • ");
}

//Horse image URL
export const getHorseProfileImageUrl = (
  horse,
  fallbackUrl = "/src/assets/images/horeImagePlaceholder.webp"
) => {
  return horse?.HorseImageUrl || fallbackUrl;
};

// Generate appropriate alt text for horse images
export function getHorseImageAltText(horse) {
  return `Image of horse named ${horse.name}`.trim();
}

// Generate full name for horse
export function getHorseFullName(horse) {
  return `${horse.horseName || ""}`.trim() || "Unknown Horse";
}

//Get horse owner name
export function getHorseOwnerName(horse) {
  return `${horse.horseOwners || ""}`.trim() || "Unknown Owner";
}

//Format horse breed
export function getHorseColor(horse) {
  return `${horse.horseColor || ""}`.trim() || "Unknown Color";
}

// Format horse age display based on value
export function formatHorseAge(birthDate) {
  if (!birthDate) return "Age unknown";

  try {
    // Parse the birth date
    const birthDateObj = new Date(birthDate);
    if (isNaN(birthDateObj.getTime())) return "Invalid birthdate";

    // Calculate age in years
    const today = new Date();
    let age = today.getFullYear() - birthDateObj.getFullYear();

    // Adjust age if birthday hasn't occurred yet this year
    const hasBirthdayOccurredThisYear =
      today.getMonth() > birthDateObj.getMonth() ||
      (today.getMonth() === birthDateObj.getMonth() &&
        today.getDate() >= birthDateObj.getDate());

    if (!hasBirthdayOccurredThisYear) {
      age--;
    }

    // Format the age string
    return `${age} ${age === 1 ? "year" : "years"} old`;
  } catch (error) {
    console.error("Error calculating horse age:", error);
    return "Age calculation error";
  }
}

// Helper to safely access nested properties
export function getNestedProperty(obj, path, defaultValue = "Not available") {
  const properties = path.split(".");
  return properties.reduce((prev, curr) => {
    return prev && prev[curr] ? prev[curr] : defaultValue;
  }, obj);
}

// Combines multiple CSS class names into a single string, filtering out falsy values
export function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

// Function to format horse age based on a owners role
export const HORSE_USER_ROLES = {
  OWNER: 0,
  RIDER: 1,
  HELPER: 2,
};

// Convert role number to readable name
export function getHorseUserRoleName(roleId) {
  switch (roleId) {
    case HORSE_USER_ROLES.OWNER:
      return "Owner";
    case HORSE_USER_ROLES.RIDER:
      return "Rider";
    case HORSE_USER_ROLES.HELPER:
      return "Helper";
    default:
      return "Unknown connection";
  }
}
