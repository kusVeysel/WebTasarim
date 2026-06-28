/**
 * TaskFlow Pro - Mock API Layer
 * Simüle edilmiş asenkron API endpoints
 */

const MockAPI = (() => {
  const DELAY = 600;

  const delay = (ms = DELAY) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const users = [
    { id: 1, name: 'Ayşe Yılmaz', email: 'ayse@taskflow.pro', role: 'admin', department: 'engineering', status: 'active', avatar: 'https://i.pravatar.cc/80?img=12', tasksCompleted: 42 },
    { id: 2, name: 'Mehmet Kaya', email: 'mehmet@taskflow.pro', role: 'manager', department: 'engineering', status: 'active', avatar: 'https://i.pravatar.cc/80?img=33', tasksCompleted: 38 },
    { id: 3, name: 'Zeynep Demir', email: 'zeynep@taskflow.pro', role: 'member', department: 'design', status: 'active', avatar: 'https://i.pravatar.cc/80?img=47', tasksCompleted: 29 },
    { id: 4, name: 'Can Öztürk', email: 'can@taskflow.pro', role: 'member', department: 'marketing', status: 'active', avatar: 'https://i.pravatar.cc/80?img=68', tasksCompleted: 21 },
    { id: 5, name: 'Elif Arslan', email: 'elif@taskflow.pro', role: 'member', department: 'sales', status: 'inactive', avatar: 'https://i.pravatar.cc/80?img=25', tasksCompleted: 15 },
    { id: 6, name: 'Burak Şahin', email: 'burak@taskflow.pro', role: 'manager', department: 'design', status: 'active', avatar: 'https://i.pravatar.cc/80?img=52', tasksCompleted: 35 },
  ];

  const defaultTasks = [
    { id: 1, title: 'Dashboard UI tasarımını tamamla', description: 'Ana dashboard arayüzünün responsive tasarımı', assigneeId: 3, priority: 'high', status: 'in-progress', dueDate: '2026-07-05', createdAt: '2026-06-20' },
    { id: 2, title: 'API entegrasyonu test et', description: 'Mock API ile fetch işlemlerini doğrula', assigneeId: 2, priority: 'high', status: 'pending', dueDate: '2026-07-10', createdAt: '2026-06-22' },
    { id: 3, title: 'Kullanıcı dokümantasyonu yaz', description: 'Kullanıcı kılavuzu ve SSS bölümü', assigneeId: 4, priority: 'medium', status: 'completed', dueDate: '2026-06-25', createdAt: '2026-06-15' },
    { id: 4, title: 'Performans optimizasyonu', description: 'Sayfa yükleme sürelerini iyileştir', assigneeId: 2, priority: 'medium', status: 'in-progress', dueDate: '2026-07-15', createdAt: '2026-06-18' },
    { id: 5, title: 'Güvenlik denetimi', description: 'XSS ve CSRF korumalarını kontrol et', assigneeId: 1, priority: 'high', status: 'pending', dueDate: '2026-07-20', createdAt: '2026-06-24' },
    { id: 6, title: 'Mobil uyumluluk testi', description: 'Tüm breakpointlerde test yap', assigneeId: 3, priority: 'low', status: 'completed', dueDate: '2026-06-28', createdAt: '2026-06-10' },
    { id: 7, title: 'E-posta bildirim sistemi', description: 'SMTP entegrasyonu ve şablonlar', assigneeId: 6, priority: 'medium', status: 'pending', dueDate: '2026-08-01', createdAt: '2026-06-26' },
    { id: 8, title: 'Veri yedekleme modülü', description: 'Otomatik yedekleme cron job', assigneeId: 2, priority: 'low', status: 'in-progress', dueDate: '2026-07-30', createdAt: '2026-06-21' },
  ];

  const activities = [
    { id: 1, user: 'Ayşe Yılmaz', action: 'yeni görev oluşturdu', target: 'Güvenlik denetimi', time: '5 dakika önce', type: 'create' },
    { id: 2, user: 'Mehmet Kaya', action: 'görevi tamamladı', target: 'API entegrasyonu test et', time: '23 dakika önce', type: 'complete' },
    { id: 3, user: 'Zeynep Demir', action: 'yorum ekledi', target: 'Dashboard UI tasarımı', time: '1 saat önce', type: 'comment' },
    { id: 4, user: 'Can Öztürk', action: 'kullanıcı davet etti', target: 'Yeni Üye', time: '2 saat önce', type: 'invite' },
    { id: 5, user: 'Burak Şahin', action: 'dosya yükledi', target: 'tasarim-v2.fig', time: '3 saat önce', type: 'upload' },
    { id: 6, user: 'Elif Arslan', action: 'görev durumunu güncelledi', target: 'Pazarlama raporu', time: '5 saat önce', type: 'update' },
  ];

  const notifications = [
    { id: 1, message: 'Yeni görev atandı: Güvenlik denetimi', time: '5 dk önce', type: 'info', read: false },
    { id: 2, message: 'Mehmet Kaya görevi tamamladı', time: '23 dk önce', type: 'success', read: false },
    { id: 3, message: 'Pro planınız 15 gün içinde yenilenecek', time: '1 saat önce', type: 'warning', read: true },
    { id: 4, message: 'Haftalık rapor hazır', time: '2 saat önce', type: 'info', read: true },
  ];

  const monthlyData = [
    { month: 'Oca', tasks: 45, completed: 38 },
    { month: 'Şub', tasks: 52, completed: 44 },
    { month: 'Mar', tasks: 48, completed: 41 },
    { month: 'Nis', tasks: 61, completed: 55 },
    { month: 'May', tasks: 55, completed: 48 },
    { month: 'Haz', tasks: 67, completed: 52 },
  ];

  const stats = {
    totalTasks: 156,
    completedTasks: 98,
    activeUsers: 24,
    completionRate: 63,
    trends: {
      tasks: { value: 12, direction: 'up' },
      completed: { value: 8, direction: 'up' },
      users: { value: 3, direction: 'up' },
      rate: { value: 2, direction: 'down' },
    },
  };

  const analyticsData = {
    week: { tasksCreated: 23, tasksCompleted: 18, avgTime: '2.4 gün', efficiency: 78 },
    month: { tasksCreated: 67, tasksCompleted: 52, avgTime: '3.1 gün', efficiency: 82 },
    year: { tasksCreated: 520, tasksCompleted: 412, avgTime: '2.8 gün', efficiency: 79 },
  };

  const handleError = (response) => {
    if (!response?.ok) {
      throw new Error(response?.statusText ?? 'API Hatası');
    }
    return response;
  };

  return {
    async fetchStats() {
      await delay(400);
      return { ...stats };
    },

    async fetchTasks() {
      await delay();
      const stored = localStorage.getItem('taskflow_tasks');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return [...defaultTasks];
        }
      }
      return [...defaultTasks];
    },

    async fetchUsers() {
      await delay(500);
      const stored = localStorage.getItem('taskflow_users');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return [...users];
        }
      }
      return [...users];
    },

    async fetchActivities() {
      await delay(300);
      return [...activities];
    },

    async fetchNotifications() {
      await delay(200);
      return [...notifications];
    },

    async fetchMonthlyData(months = 6) {
      await delay(400);
      return monthlyData.slice(-months);
    },

    async fetchAnalytics(period = 'month') {
      await delay(500);
      return analyticsData[period] ?? analyticsData.month;
    },

    async saveTasks(tasks) {
      await delay(200);
      localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
      return { success: true };
    },

    async saveUsers(usersList) {
      await delay(200);
      localStorage.setItem('taskflow_users', JSON.stringify(usersList));
      return { success: true };
    },

    simulateFetch(url) {
      return delay().then(() => ({
        ok: true,
        json: () => Promise.resolve({ url, timestamp: Date.now() }),
      }));
    },
  };
})();

window.MockAPI = MockAPI;
