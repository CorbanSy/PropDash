//levlpro-mvp\src\components\CustomerDashboard\MyJobs\components\PostJobModal\utils\validation.js

export function validateJobForm(formData) {
  if (!formData.jobTitle.trim()) {
    return "Please enter a job title";
  }
  
  if (!formData.category) {
    return "Please select a category";
  }
  
  if (!formData.description.trim()) {
    return "Please enter a job description";
  }
  
  if (!formData.useDefaultAddress) {
    if (!formData.address || !formData.city || !formData.zipCode) {
      return "Please fill in all address fields";
    }
  }
  
  return null; // No errors
}

export function parseAddress(addressString) {
  const addressParts = addressString.split(", ");
  if (addressParts.length >= 3) {
    return {
      address: addressParts[0] || "",
      city: addressParts[1] || "",
      zipCode: addressParts[2] || "",
    };
  }
  return null;
}

export function formatJobAddress(formData, customerData) {
  if (formData.useDefaultAddress && customerData) {
    return `${customerData.address}${
      customerData.city ? `, ${customerData.city}` : ""
    }${customerData.state ? `, ${customerData.state}` : ""}${
      customerData.zip_code ? ` ${customerData.zip_code}` : ""
    }`;
  }
  
  return `${formData.address}${
    formData.unit ? `, ${formData.unit}` : ""
  }, ${formData.city}, ${formData.zipCode}`;
}