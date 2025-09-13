// Mock API for chat functionality

import initialAchievements from '../data/achievements.json';
import initialUsers from '../data/users.json';

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
  },

  getCollegeAchievements: (): Promise<any[]> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const achievements = getFromStorage('achievements', initialAchievements);
          const users = getFromStorage('users', initialUsers);

          // Enrich each achievement with the student's name and branch
          const enrichedAchievements = achievements
            .filter((ach: any) => ach.approved) // Only show approved achievements
            .map((achievement: any) => {
              const student = users.find((user: any) => user.id === achievement.studentId);
              return {
                ...achievement,
                studentName: student ? student.name : 'Unknown Student',
                studentBranch: student ? student.branch : 'N/A',
              };
            })
            // Sort by most recent date first
            .sort((a: { date: string | number | Date; }, b: { date: string | number | Date; }) => new Date(b.date).getTime() - new Date(a.date).getTime());

          resolve(enrichedAchievements);
        }, 600);
      });
    },

  async getStudentAttendance(userId: string) {
    // Mock attendance records for the student
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    
    const mockAttendanceRecords = [
      {
        id: '1',
        startDate: '2025-09-01',
        endDate: '2025-09-03',
        reason: 'Fever and cold',
        status: 'approved' as const
      },
      {
        id: '2',
        startDate: '2025-08-15',
        endDate: '2025-08-16',
        reason: 'Medical checkup',
        status: 'approved' as const
      },
      {
        id: '3',
        startDate: '2025-09-10',
        endDate: '2025-09-11',
        reason: 'Stomach flu',
        status: 'pending' as const
      }
    ];

    return mockAttendanceRecords;
  },

  async submitSickLeave(data: { studentId: string; startDate: string; endDate: string; reason: string }) {
    // Mock submitting sick leave request
    console.log('Submitting sick leave:', data);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock successful submission
    return {
      success: true,
      message: 'Sick leave request submitted successfully. Awaiting faculty approval.'
    };
  },
};
function getFromStorage(key: string, defaultValue: any) {
  // For mock purposes, return the default value
  return defaultValue;
}

