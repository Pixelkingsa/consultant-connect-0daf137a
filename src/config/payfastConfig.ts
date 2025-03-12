
// PayFast Configuration
export const PAYFAST_CONFIG = {
  // In a production environment, these would be fetched from environment variables
  MERCHANT_ID: "10000100", // Default sandbox merchant ID
  MERCHANT_KEY: "46f0cd694581a", // Default sandbox merchant key
  PASSPHRASE: "payfast", // Only needed for API calls
  IS_TEST_MODE: true, // Set to false for production
  
  // PayFast URLs
  PROCESS_URL: "https://sandbox.payfast.co.za/onsite/process",
  PRODUCTION_URL: "https://www.payfast.co.za/onsite/process",
  
  // Get the correct process URL based on test mode
  getProcessUrl() {
    return this.IS_TEST_MODE ? this.PROCESS_URL : this.PRODUCTION_URL;
  }
};
