import { Profile } from "@/types";

const generateUid = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

const generateRandomProfile = (): Profile => {
  return {
    uid: generateUid(),
    firstName: "John",
    lastName: "Doe",
    age: Math.floor(Math.random() * 100) + 1,
  };
};

const profilesDb: Profile[] = Array.from({ length: 3 }, generateRandomProfile);

export const loadProfiles = (): Promise<Profile[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(profilesDb);
    }, 3000);
  });
};
