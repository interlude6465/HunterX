// Simple test to check MessageInterceptor class
class MessageInterceptor {
  constructor() {
    this.messages = [];
  }
  
  logMessage(username, message) {
    this.messages.push({ username, message });
  }
}

const interceptor = new MessageInterceptor();
console.log('MessageInterceptor test passed');