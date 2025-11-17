// Mock resource_farming module for testing
module.exports = { 
  createFarmSystem: () => ({ 
    tryHandleChat: async (username, message) => {
      // Mock implementation - doesn't handle any chat
      return false;
    }
  }) 
};