// Mock API for chat functionality
export const api = {
  async getChatData(userId: string) {
    // Mock data for channels and users
    const mockChannels = [
      {
        id: '1',
        name: 'general',
        type: 'channel',
        members: ['1', '2', '3', '4', '5']
      },
      {
        id: '2',
        name: 'computer-science',
        type: 'channel',
        members: ['1', '2', '4', '5']
      },
      {
        id: '3',
        name: 'study-group',
        type: 'channel',
        members: ['1', '3', '4']
      },
      {
        id: '4',
        name: 'dm',
        type: 'dm',
        members: ['1', '2']
      },
      {
        id: '5',
        name: 'dm',
        type: 'dm',
        members: ['1', '3']
      }
    ];

    const mockUsers = [
      { id: '1', name: 'John Student' },
      { id: '2', name: 'Sarah Johnson' },
      { id: '3', name: 'Mike Chen' },
      { id: '4', name: 'Emily Davis' },
      { id: '5', name: 'Alex Rodriguez' }
    ];

    return {
      channels: mockChannels,
      users: mockUsers
    };
  },

  async getMessagesForChannel(channelId: string) {
    // Mock messages for each channel
    const mockMessages: { [key: string]: any[] } = {
      '1': [
        {
          id: '1',
          authorId: '2',
          content: 'Hey everyone! How are you doing with the midterm exams?',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString()
        },
        {
          id: '2',
          authorId: '4',
          content: 'Pretty good! The math exam was challenging but I think I did well 😊',
          timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString()
        },
        {
          id: '3',
          authorId: '1',
          content: 'Same here! The AI project is keeping me busy though.',
          timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString()
        }
      ],
      '2': [
        {
          id: '4',
          authorId: '1',
          content: 'Anyone working on the neural network assignment?',
          timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString()
        },
        {
          id: '5',
          authorId: '5',
          content: 'I can help! Which part are you struggling with?',
          timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString()
        }
      ],
      '3': [
        {
          id: '6',
          authorId: '4',
          content: 'Study session tomorrow at the library at 2 PM. Who\'s joining?',
          timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString()
        }
      ],
      '4': [
        {
          id: '7',
          authorId: '2',
          content: 'Hey! How\'s your day going?',
          timestamp: new Date(Date.now() - 1000 * 60 * 40).toISOString()
        },
        {
          id: '8',
          authorId: '1',
          content: 'Great! Just finished my assignments. You?',
          timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString()
        }
      ],
      '5': [
        {
          id: '9',
          authorId: '3',
          content: 'Want to grab lunch later?',
          timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString()
        }
      ]
    };

    return mockMessages[channelId] || [];
  },

  async sendMessage(messageData: { channelId: string; authorId: string; content: string }) {
    // Mock sending a message
    console.log('Sending message:', messageData);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock auto-reply for some channels
    if (messageData.channelId === '2' && messageData.content.includes('help')) {
      setTimeout(() => {
        // This would trigger a new message in real implementation
        console.log('Auto-reply would be sent here');
      }, 2000);
    }
    
    return { success: true, messageId: Date.now().toString() };
  }
};
