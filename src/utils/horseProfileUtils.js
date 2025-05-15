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
  fallbackUrl = "/src/assets/images/horsePlaceholder.jpg"
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
export function formatHorseAge(age) {
  if (!age) return "Not available";
  return isNaN(age) ? age : `${age} years`;
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
