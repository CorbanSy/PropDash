// src/components/CustomerDashboard/MyJobs/components/PostJobModal/utils/constants.js
export const DEFAULT_FORM_DATA = {
  jobTitle: "",
  category: "",
  description: "",
  photos: [],
  useDefaultAddress: true,
  address: "",
  unit: "",
  city: "",
  zipCode: "",
  schedulingType: "flexible",
  preferredDate: "",
  backupDate: "",
  allowMultiplePros: true,
  needMaterials: false,
  mustBeLicensed: false,
  weekendAvailability: false,
  sameDayAvailability: false,
  petsInHome: false,
  parkingInfo: "",
  notifyViaSMS: true,
  notifyViaEmail: true,
};

export const MAX_PHOTOS = 5;
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB