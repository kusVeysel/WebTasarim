/**
 * TaskFlow Pro - Main Application (ES6+)
 * State management, API integration, DOM rendering
 */

const App = (() => {
  const STORAGE_KEYS = {
    darkMode: 'taskflow_darkMode',
    accent: 'taskflow_accent',
    fontSize: 'taskflow_fontSize',
    settings: 'taskflow_settings',
    currentSection: 'taskflow_section',
  };

  let state = {
    tasks: [],
    users: [],
    activities: [],
    notifications: [],
    stats: null,
    monthlyData: [],
    analytics: null,
    currentSection: 'dashboard',
    darkMode: false,
    accent: 'purple',
    fontSize: 16,
    taskFilters: { search: '', status: 'all', priority: 'all' },
    userFilters: { search: '', role: 'all', status: 'all' },
    analyticsPeriod: 'month',
    isLoading: false,
  };

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => document.querySelectorAll(selector);

  // ---------- State Management ----------
  const loadState = () => {
    try {
      const darkMode = localStorage.getItem(STORAGE_KEYS.darkMode);
      if (darkMode !== null) state.darkMode = JSON.parse(darkMode);

      const accent = localStorage.getItem(STORAGE_KEYS.accent);
      if (accent) state.accent = accent;

      const fontSize = localStorage.getItem(STORAGE_KEYS.fontSize);
      if (fontSize) state.fontSize = parseInt(fontSize, 10);

      const section = localStorage.getItem(STORAGE_KEYS.currentSection);
      if (section) state.currentSection = section;
    } catch (e) {
      console.warn('State yükleme hatası:', e);
    }
  };

  const saveState = (key, value) => {
    try {
      localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
    } catch (e) {
      console.warn('State kaydetme hatası:', e);
    }
  };

  const applyTheme = () => {
    document.documentElement.setAttribute('data-theme', state.darkMode ? 'dark' : 'light');
    document.documentElement.setAttribute('data-accent', state.accent);
    document.documentElement.style.fontSize = `${state.fontSize}px`;

    const darkIcon = $('#darkModeIcon');
    if (darkIcon) {
      darkIcon.className = state.darkMode ? 'bi bi-sun-fill' : 'bi bi-moon-fill';
    }

    const settingsDark = $('#settingsDarkMode');
    if (settingsDark) settingsDark.checked = state.darkMode;

    const accentSelect = $('#accentColor');
    if (accentSelect) accentSelect.value = state.accent;

    const fontRange = $('#fontSize');
    if (fontRange) fontRange.value = state.fontSize;
  };

  const toggleDarkMode = () => {
    state.darkMode = !state.darkMode;
    saveState(STORAGE_KEYS.darkMode, state.darkMode);
    applyTheme();
    showAlert('Görünüm modu güncellendi.', state.darkMode ? 'info' : 'success');
  };

  // ---------- Loading ----------
  const showLoading = (show = true) => {
    state.isLoading = show;
    const overlay = $('#loadingOverlay');
    overlay?.classList.toggle('active', show);
    overlay?.setAttribute('aria-hidden', String(!show));
  };

  // ---------- Alerts ----------
  const showAlert = (message, type = 'success', duration = 4000) => {
    const container = $('#alertContainer');
    if (!container) return;

    const icons = { success: 'check-circle', danger: 'exclamation-triangle', warning: 'exclamation-circle', info: 'info-circle' };
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.setAttribute('role', 'alert');
    alert.innerHTML = `
      <i class="bi bi-${icons[type] ?? 'info-circle'} me-2"></i>
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Kapat"></button>
    `;
    container.appendChild(alert);

    setTimeout(() => {
      alert.classList.remove('show');
      setTimeout(() => alert.remove(), 300);
    }, duration);
  };

  // ---------- Navigation ----------
  const navigateTo = (section) => {
    state.currentSection = section;
    saveState(STORAGE_KEYS.currentSection, section);

    $$('.content-section').forEach((el) => el.classList.remove('active'));
    $(`#section-${section}`)?.classList.add('active');

    $$('.nav-link[data-section]').forEach((link) => {
      const isActive = link.dataset.section === section;
      link.classList.toggle('active', isActive);
      link.setAttribute('aria-current', isActive ? 'page' : null);
    });

    if (window.innerWidth < 992) {
      document.getElementById('sidebar')?.classList.remove('mobile-open');
      document.getElementById('sidebarOverlay')?.classList.remove('active');
    }
  };

  // ---------- Data Fetching ----------
  const fetchAllData = async () => {
    showLoading(true);
    try {
      const [stats, tasks, users, activities, notifications, monthlyData] = await Promise.all([
        MockAPI.fetchStats(),
        MockAPI.fetchTasks(),
        MockAPI.fetchUsers(),
        MockAPI.fetchActivities(),
        MockAPI.fetchNotifications(),
        MockAPI.fetchMonthlyData(6),
      ]);

      state.stats = stats;
      state.tasks = tasks;
      state.users = users;
      state.activities = activities;
      state.notifications = notifications;
      state.monthlyData = monthlyData;

      renderAll();
    } catch (error) {
      console.error('Veri yükleme hatası:', error);
      showAlert('Veriler yüklenirken bir hata oluştu.', 'danger');
    } finally {
      showLoading(false);
    }
  };

  const fetchAnalytics = async (period = 'month') => {
    state.analyticsPeriod = period;
    try {
      state.analytics = await MockAPI.fetchAnalytics(period);
      renderAnalytics();
    } catch (error) {
      console.error('Analitik yükleme hatası:', error);
    }
  };

  // ---------- Render Functions ----------
  const renderAll = () => {
    renderStats();
    renderPerformanceChart();
    renderDonutChart();
    renderActivities();
    renderQuickTasks();
    renderTasks();
    renderUsers();
    renderNotifications();
    renderAssigneeOptions();
    updateTaskBadge();
    fetchAnalytics(state.analyticsPeriod);
  };

  const renderStats = () => {
    const container = $('#statsCards');
    const stats = state.stats;
    if (!container || !stats) return;

    const cards = [
      { label: 'Toplam Görev', value: stats.totalTasks, icon: 'check2-square', color: 'purple', trend: stats.trends?.tasks },
      { label: 'Tamamlanan', value: stats.completedTasks, icon: 'check-circle', color: 'green', trend: stats.trends?.completed },
      { label: 'Aktif Kullanıcı', value: stats.activeUsers, icon: 'people', color: 'blue', trend: stats.trends?.users },
      { label: 'Tamamlanma Oranı', value: `${stats.completionRate}%`, icon: 'graph-up', color: 'orange', trend: stats.trends?.rate },
    ];

    container.innerHTML = cards.map((card) => `
      <div class="col-sm-6 col-xl-3">
        <article class="card glass-card stat-card">
          <div class="stat-card-header">
            <div class="stat-icon ${card.color}">
              <i class="bi bi-${card.icon}" aria-hidden="true"></i>
            </div>
            ${card.trend ? `
              <span class="stat-trend ${card.trend.direction}">
                <i class="bi bi-arrow-${card.trend.direction === 'up' ? 'up' : 'down'}" aria-hidden="true"></i>
                ${card.trend.value}%
              </span>
            ` : ''}
          </div>
          <div class="stat-value">${card.value}</div>
          <div class="stat-label">${card.label}</div>
        </article>
      </div>
    `).join('');
  };

  const renderPerformanceChart = () => {
    const container = $('#performanceChart');
    const data = state.monthlyData;
    if (!container || !data?.length) return;

    container.innerHTML = '<canvas id="barCanvas"></canvas>';
    const canvas = $('#barCanvas');
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const padding = { top: 20, right: 20, bottom: 40, left: 50 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    const maxVal = Math.max(...data.map((d) => d.tasks)) * 1.2;
    const barWidth = chartW / data.length / 2.5;
    const gap = chartW / data.length;

    const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#7c3aed';
    const accentLight = getComputedStyle(document.documentElement).getPropertyValue('--accent-light').trim() || '#a78bfa';
    const isDark = state.darkMode;
    const gridColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
    const textColor = isDark ? '#94a3b8' : '#64748b';

    ctx.clearRect(0, 0, w, h);

    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartH / 4) * i;
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(w - padding.right, y);
      ctx.stroke();

      ctx.fillStyle = textColor;
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'right';
      const val = Math.round(maxVal - (maxVal / 4) * i);
      ctx.fillText(val, padding.left - 8, y + 4);
    }

    data.forEach((d, i) => {
      const x = padding.left + gap * i + gap / 2;
      const taskH = (d.tasks / maxVal) * chartH;
      const compH = (d.completed / maxVal) * chartH;

      const grad1 = ctx.createLinearGradient(0, padding.top + chartH - taskH, 0, padding.top + chartH);
      grad1.addColorStop(0, accent);
      grad1.addColorStop(1, accentLight);

      ctx.fillStyle = grad1;
      ctx.beginPath();
      ctx.roundRect(x - barWidth - 2, padding.top + chartH - taskH, barWidth, taskH, [4, 4, 0, 0]);
      ctx.fill();

      ctx.fillStyle = isDark ? 'rgba(16,185,129,0.7)' : 'rgba(16,185,129,0.8)';
      ctx.beginPath();
      ctx.roundRect(x + 2, padding.top + chartH - compH, barWidth, compH, [4, 4, 0, 0]);
      ctx.fill();

      ctx.fillStyle = textColor;
      ctx.font = '12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(d.month, x, h - 12);
    });
  };

  const renderDonutChart = () => {
    const tasks = state.tasks;
    const container = $('#donutChart');
    const legend = $('#donutLegend');
    if (!container || !legend) return;

    const counts = {
      completed: tasks.filter((t) => t.status === 'completed').length,
      'in-progress': tasks.filter((t) => t.status === 'in-progress').length,
      pending: tasks.filter((t) => t.status === 'pending').length,
    };
    const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;

    const colors = { completed: '#10b981', 'in-progress': '#3b82f6', pending: '#94a3b8' };
    const labels = { completed: 'Tamamlandı', 'in-progress': 'Devam Ediyor', pending: 'Beklemede' };

    let offset = 0;
    const circumference = 2 * Math.PI * 60;
    const segments = Object.entries(counts).map(([key, val]) => {
      const pct = val / total;
      const dash = pct * circumference;
      const seg = { key, val, pct, dash, offset, color: colors[key] };
      offset += dash;
      return seg;
    });

    const completedPct = Math.round((counts.completed / total) * 100);

    container.innerHTML = `
      <div class="donut-chart">
        <svg viewBox="0 0 140 140">
          <circle cx="70" cy="70" r="60" fill="none" stroke="${state.darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}" stroke-width="14"/>
          ${segments.map((s) => `
            <circle cx="70" cy="70" r="60" fill="none" stroke="${s.color}" stroke-width="14"
              stroke-dasharray="${s.dash} ${circumference - s.dash}" stroke-dashoffset="${-s.offset}"
              style="transition: stroke-dasharray 0.8s ease"/>
          `).join('')}
        </svg>
        <div class="donut-center">
          <span class="donut-center-value">${completedPct}%</span>
          <span class="donut-center-label">Tamamlandı</span>
        </div>
      </div>
    `;

    legend.innerHTML = segments.map((s) => `
      <li>
        <span class="legend-label">
          <span class="legend-dot" style="background:${s.color}"></span>
          ${labels[s.key]}
        </span>
        <span class="legend-value">${s.val}</span>
      </li>
    `).join('');
  };

  const renderActivities = () => {
    const container = $('#activityList');
    if (!container) return;

    const typeIcons = {
      create: { icon: 'plus-circle', color: 'rgba(124,58,237,0.15)', text: 'var(--accent)' },
      complete: { icon: 'check-circle', color: 'rgba(16,185,129,0.15)', text: '#10b981' },
      comment: { icon: 'chat-dots', color: 'rgba(59,130,246,0.15)', text: '#3b82f6' },
      invite: { icon: 'person-plus', color: 'rgba(245,158,11,0.15)', text: '#f59e0b' },
      upload: { icon: 'cloud-upload', color: 'rgba(124,58,237,0.15)', text: 'var(--accent)' },
      update: { icon: 'pencil', color: 'rgba(59,130,246,0.15)', text: '#3b82f6' },
    };

    container.innerHTML = state.activities.map((act) => {
      const ti = typeIcons[act.type] ?? typeIcons.update;
      return `
        <li class="activity-item">
          <div class="activity-icon" style="background:${ti.color}; color:${ti.text}">
            <i class="bi bi-${ti.icon}" aria-hidden="true"></i>
          </div>
          <div class="activity-content">
            <p class="activity-text"><strong>${act.user}</strong> ${act.action}: <em>${act.target}</em></p>
            <span class="activity-time">${act.time}</span>
          </div>
        </li>
      `;
    }).join('');
  };

  const renderQuickTasks = () => {
    const container = $('#quickTaskList');
    if (!container) return;

    const pending = state.tasks
      .filter((t) => t.status !== 'completed')
      .slice(0, 5);

    if (!pending.length) {
      container.innerHTML = '<li class="empty-state"><i class="bi bi-check2-all"></i><p>Tüm görevler tamamlandı!</p></li>';
      return;
    }

    container.innerHTML = pending.map((task) => `
      <li class="quick-task-item" data-task-id="${task.id}">
        <input type="checkbox" class="quick-task-check" ${task.status === 'completed' ? 'checked' : ''} aria-label="${task.title} tamamla">
        <span class="quick-task-title">${task.title}</span>
        <span class="quick-task-priority priority-${task.priority}">${task.priority === 'high' ? 'Yüksek' : task.priority === 'medium' ? 'Orta' : 'Düşük'}</span>
      </li>
    `).join('');

    container.querySelectorAll('.quick-task-check').forEach((cb) => {
      cb.addEventListener('change', async (e) => {
        const item = e.target.closest('.quick-task-item');
        const taskId = parseInt(item?.dataset.taskId, 10);
        const task = state.tasks.find((t) => t.id === taskId);
        if (task) {
          task.status = e.target.checked ? 'completed' : 'pending';
          await MockAPI.saveTasks(state.tasks);
          item.classList.toggle('completed', e.target.checked);
          renderDonutChart();
          updateTaskBadge();
          showAlert(`"${task.title}" ${e.target.checked ? 'tamamlandı' : 'geri alındı'}.`, 'success');
        }
      });
    });
  };

  const getFilteredTasks = () => {
    const { search, status, priority } = state.taskFilters;
    return state.tasks.filter((task) => {
      const matchSearch = !search ||
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description?.toLowerCase().includes(search.toLowerCase());
      const matchStatus = status === 'all' || task.status === status;
      const matchPriority = priority === 'all' || task.priority === priority;
      return matchSearch && matchStatus && matchPriority;
    });
  };

  const getUserById = (id) => state.users.find((u) => u.id === id);

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const renderTasks = () => {
    const tbody = $('#tasksTableBody');
    const countEl = $('#taskCount');
    if (!tbody) return;

    const filtered = getFilteredTasks();

    if (!filtered.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="text-center py-5">
            <div class="empty-state">
              <i class="bi bi-inbox"></i>
              <p>Görev bulunamadı</p>
            </div>
          </td>
        </tr>
      `;
      if (countEl) countEl.textContent = '0 görev gösteriliyor';
      return;
    }

    const statusLabels = { pending: 'Beklemede', 'in-progress': 'Devam Ediyor', completed: 'Tamamlandı' };
    const priorityLabels = { high: 'Yüksek', medium: 'Orta', low: 'Düşük' };

    tbody.innerHTML = filtered.map((task) => {
      const user = getUserById(task.assigneeId);
      return `
        <tr data-task-id="${task.id}">
          <td><input type="checkbox" class="form-check-input task-checkbox" value="${task.id}" aria-label="Seç"></td>
          <td>
            <div class="task-title-cell">${task.title}</div>
            <div class="task-desc-sm">${task.description ?? ''}</div>
          </td>
          <td>
            <div class="assignee-cell">
              <img src="${user?.avatar ?? 'https://i.pravatar.cc/80?img=1'}" alt="${user?.name ?? 'Atanmamış'}" class="assignee-avatar" width="30" height="30">
              <span>${user?.name ?? 'Atanmamış'}</span>
            </div>
          </td>
          <td><span class="quick-task-priority priority-${task.priority}">${priorityLabels[task.priority]}</span></td>
          <td><span class="status-badge status-${task.status}">${statusLabels[task.status]}</span></td>
          <td>${formatDate(task.dueDate)}</td>
          <td>
            <button class="action-btn edit-task-btn" data-id="${task.id}" aria-label="Düzenle"><i class="bi bi-pencil"></i></button>
            <button class="action-btn delete delete-task-btn" data-id="${task.id}" aria-label="Sil"><i class="bi bi-trash"></i></button>
          </td>
        </tr>
      `;
    }).join('');

    if (countEl) countEl.textContent = `${filtered.length} görev gösteriliyor`;
  };

  const getFilteredUsers = () => {
    const { search, role, status } = state.userFilters;
    return state.users.filter((user) => {
      const matchSearch = !search ||
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());
      const matchRole = role === 'all' || user.role === role;
      const matchStatus = status === 'all' || user.status === status;
      return matchSearch && matchRole && matchStatus;
    });
  };

  const renderUsers = () => {
    const statsContainer = $('#userStats');
    const grid = $('#usersGrid');
    if (!statsContainer || !grid) return;

    const users = state.users;
    const active = users.filter((u) => u.status === 'active').length;

    statsContainer.innerHTML = `
      <div class="col-sm-4">
        <div class="card glass-card user-stat-card">
          <div class="user-stat-value">${users.length}</div>
          <div class="user-stat-label">Toplam Kullanıcı</div>
        </div>
      </div>
      <div class="col-sm-4">
        <div class="card glass-card user-stat-card">
          <div class="user-stat-value">${active}</div>
          <div class="user-stat-label">Aktif Kullanıcı</div>
        </div>
      </div>
      <div class="col-sm-4">
        <div class="card glass-card user-stat-card">
          <div class="user-stat-value">${users.filter((u) => u.role === 'admin').length}</div>
          <div class="user-stat-label">Admin</div>
        </div>
      </div>
    `;

    const filtered = getFilteredUsers();
    const roleLabels = { admin: 'Admin', manager: 'Yönetici', member: 'Üye' };

    if (!filtered.length) {
      grid.innerHTML = '<div class="col-12"><div class="empty-state"><i class="bi bi-people"></i><p>Kullanıcı bulunamadı</p></div></div>';
      return;
    }

    grid.innerHTML = filtered.map((user) => `
      <div class="col-sm-6 col-lg-4 col-xl-3">
        <article class="card glass-card user-card">
          <img src="${user.avatar}" alt="${user.name}" class="user-card-avatar" width="72" height="72" loading="lazy">
          <div class="user-card-name">${user.name}</div>
          <div class="user-card-email">${user.email}</div>
          <span class="user-card-role role-${user.role}">${roleLabels[user.role]}</span>
          <div class="user-status">
            <span class="status-dot ${user.status}"></span>
            ${user.status === 'active' ? 'Aktif' : 'Pasif'}
          </div>
        </article>
      </div>
    `).join('');
  };

  const renderNotifications = () => {
    const list = $('#notificationList');
    if (!list) return;

    const unread = state.notifications.filter((n) => !n.read).length;
    const dot = $('#notificationDot');
    if (dot) dot.style.display = unread > 0 ? 'block' : 'none';

    const items = state.notifications.map((n) => `
      <li>
        <a class="dropdown-item ${n.read ? '' : 'fw-semibold'}" href="#">
          <div class="notification-item">
            <div class="notif-icon ${n.type}"><i class="bi bi-${n.type === 'success' ? 'check' : n.type === 'warning' ? 'exclamation' : 'info'}-circle"></i></div>
            <div>
              <div>${n.message}</div>
              <small class="text-muted">${n.time}</small>
            </div>
          </div>
        </a>
      </li>
    `).join('');

    list.innerHTML = `
      <li class="dropdown-header d-flex justify-content-between">
        Bildirimler ${unread > 0 ? `<span class="badge bg-primary">${unread}</span>` : ''}
      </li>
      <li><hr class="dropdown-divider"></li>
      ${items}
    `;
  };

  const renderAnalytics = () => {
    const statsContainer = $('#analyticsStats');
    const completionChart = $('#completionChart');
    const teamEfficiency = $('#teamEfficiency');
    const data = state.analytics;
    if (!data || !statsContainer) return;

    const periodLabels = { week: 'Bu Hafta', month: 'Bu Ay', year: 'Bu Yıl' };

    statsContainer.innerHTML = `
      <div class="col-sm-6 col-xl-3">
        <article class="card glass-card stat-card">
          <div class="stat-value">${data.tasksCreated}</div>
          <div class="stat-label">${periodLabels[state.analyticsPeriod]} Oluşturulan</div>
        </article>
      </div>
      <div class="col-sm-6 col-xl-3">
        <article class="card glass-card stat-card">
          <div class="stat-value">${data.tasksCompleted}</div>
          <div class="stat-label">${periodLabels[state.analyticsPeriod]} Tamamlanan</div>
        </article>
      </div>
      <div class="col-sm-6 col-xl-3">
        <article class="card glass-card stat-card">
          <div class="stat-value">${data.avgTime}</div>
          <div class="stat-label">Ort. Tamamlanma</div>
        </article>
      </div>
      <div class="col-sm-6 col-xl-3">
        <article class="card glass-card stat-card">
          <div class="stat-value">${data.efficiency}%</div>
          <div class="stat-label">Verimlilik</div>
        </article>
      </div>
    `;

    if (completionChart) {
      const categories = [
        { label: 'Mühendislik', value: 85 },
        { label: 'Tasarım', value: 72 },
        { label: 'Pazarlama', value: 68 },
        { label: 'Satış', value: 91 },
      ];

      completionChart.innerHTML = categories.map((c) => `
        <div class="progress-item">
          <div class="progress-header">
            <span class="progress-label">${c.label}</span>
            <span class="progress-value">${c.value}%</span>
          </div>
          <div class="progress-bar-custom">
            <div class="progress-fill" style="width: ${c.value}%"></div>
          </div>
        </div>
      `).join('');
    }

    if (teamEfficiency) {
      const topUsers = [...state.users]
        .sort((a, b) => (b.tasksCompleted ?? 0) - (a.tasksCompleted ?? 0))
        .slice(0, 5);

      teamEfficiency.innerHTML = topUsers.map((user) => `
        <div class="team-member-row">
          <img src="${user.avatar}" alt="${user.name}" class="team-avatar" width="36" height="36" loading="lazy">
          <div class="team-info">
            <div class="team-name">${user.name}</div>
            <div class="team-tasks">${user.tasksCompleted ?? 0} görev tamamlandı</div>
          </div>
          <div class="team-score">${Math.min(100, (user.tasksCompleted ?? 0) * 2)}%</div>
        </div>
      `).join('');
    }
  };

  const renderAssigneeOptions = () => {
    const selects = ['#taskAssignee', '#editTaskAssignee'];
    selects.forEach((sel) => {
      const el = $(sel);
      if (!el) return;
      const current = el.value;
      el.innerHTML = `<option value="">Seçin...</option>` +
        state.users
          .filter((u) => u.status === 'active')
          .map((u) => `<option value="${u.id}">${u.name}</option>`)
          .join('');
      if (current) el.value = current;
    });
  };

  const updateTaskBadge = () => {
    const badge = $('#taskBadge');
    if (badge) {
      const pending = state.tasks.filter((t) => t.status !== 'completed').length;
      badge.textContent = pending;
    }
  };

  // ---------- CRUD Operations ----------
  const addTask = async (taskData) => {
    const newTask = {
      id: Date.now(),
      ...taskData,
      createdAt: new Date().toISOString().split('T')[0],
    };
    state.tasks.unshift(newTask);
    await MockAPI.saveTasks(state.tasks);
    renderTasks();
    renderQuickTasks();
    renderDonutChart();
    updateTaskBadge();
    showAlert('Görev başarıyla oluşturuldu.', 'success');
  };

  const updateTask = async (id, taskData) => {
    const index = state.tasks.findIndex((t) => t.id === id);
    if (index === -1) return;
    state.tasks[index] = { ...state.tasks[index], ...taskData };
    await MockAPI.saveTasks(state.tasks);
    renderTasks();
    renderQuickTasks();
    renderDonutChart();
    updateTaskBadge();
    showAlert('Görev güncellendi.', 'success');
  };

  const deleteTask = async (id) => {
    state.tasks = state.tasks.filter((t) => t.id !== id);
    await MockAPI.saveTasks(state.tasks);
    renderTasks();
    renderQuickTasks();
    renderDonutChart();
    updateTaskBadge();
    showAlert('Görev silindi.', 'warning');
  };

  const addUser = async (userData) => {
    const newUser = {
      id: Date.now(),
      ...userData,
      status: 'active',
      avatar: `https://i.pravatar.cc/80?img=${Math.floor(Math.random() * 70) + 1}`,
      tasksCompleted: 0,
    };
    state.users.push(newUser);
    await MockAPI.saveUsers(state.users);
    renderUsers();
    renderAssigneeOptions();
    showAlert('Kullanıcı eklendi.', 'success');
  };

  const clearAllData = () => {
    localStorage.removeItem('taskflow_tasks');
    localStorage.removeItem('taskflow_users');
    showAlert('Tüm veriler temizlendi. Sayfa yenileniyor...', 'warning');
    setTimeout(() => location.reload(), 1500);
  };

  // ---------- Form Handlers ----------
  const setupForms = () => {
    $('#newTaskForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = e.target;
      if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
      }

      await addTask({
        title: $('#taskTitle').value.trim(),
        description: $('#taskDescription').value.trim(),
        assigneeId: parseInt($('#taskAssignee').value, 10),
        priority: $('#taskPriority').value,
        status: $('#taskStatus').value,
        dueDate: $('#taskDueDate').value,
      });

      form.reset();
      form.classList.remove('was-validated');
      bootstrap.Modal.getInstance($('#newTaskModal'))?.hide();
    });

    $('#editTaskForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = e.target;
      if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
      }

      const id = parseInt($('#editTaskId').value, 10);
      await updateTask(id, {
        title: $('#editTaskTitle').value.trim(),
        description: $('#editTaskDescription').value.trim(),
        assigneeId: parseInt($('#editTaskAssignee').value, 10),
        priority: $('#editTaskPriority').value,
        status: $('#editTaskStatus').value,
        dueDate: $('#editTaskDueDate').value,
      });

      bootstrap.Modal.getInstance($('#editTaskModal'))?.hide();
    });

    $('#deleteTaskBtn')?.addEventListener('click', () => {
      const id = parseInt($('#editTaskId').value, 10);
      bootstrap.Modal.getInstance($('#editTaskModal'))?.hide();
      showConfirmModal('Bu görevi silmek istediğinize emin misiniz?', () => deleteTask(id));
    });

    $('#newUserForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = e.target;
      if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
      }

      await addUser({
        name: $('#userName').value.trim(),
        email: $('#userEmail').value.trim(),
        role: $('#userRole').value,
        department: $('#userDepartment').value,
      });

      form.reset();
      form.classList.remove('was-validated');
      bootstrap.Modal.getInstance($('#newUserModal'))?.hide();
    });

    $('#profileForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const form = e.target;
      if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
      }
      showAlert('Profil bilgileri kaydedildi.', 'success');
    });

    $('#clearDataBtn')?.addEventListener('click', () => {
      showConfirmModal('Tüm görev ve kullanıcı verileri silinecek. Emin misiniz?', clearAllData);
    });
  };

  const showConfirmModal = (message, onConfirm) => {
    $('#confirmModalBody').textContent = message;
    const modal = new bootstrap.Modal($('#confirmModal'));
    const btn = $('#confirmModalBtn');
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    newBtn.addEventListener('click', () => {
      modal.hide();
      onConfirm?.();
    });
    modal.show();
  };

  const openEditTaskModal = (taskId) => {
    const task = state.tasks.find((t) => t.id === taskId);
    if (!task) return;

    $('#editTaskId').value = task.id;
    $('#editTaskTitle').value = task.title;
    $('#editTaskDescription').value = task.description ?? '';
    $('#editTaskAssignee').value = task.assigneeId;
    $('#editTaskPriority').value = task.priority;
    $('#editTaskStatus').value = task.status;
    $('#editTaskDueDate').value = task.dueDate;

    new bootstrap.Modal($('#editTaskModal')).show();
  };

  // ---------- Event Delegation ----------
  const setupEvents = () => {
    document.addEventListener('click', (e) => {
      const navLink = e.target.closest('.nav-link[data-section], .nav-link-inline[data-section]');
      if (navLink) {
        e.preventDefault();
        navigateTo(navLink.dataset.section);
      }

      const editBtn = e.target.closest('.edit-task-btn');
      if (editBtn) openEditTaskModal(parseInt(editBtn.dataset.id, 10));

      const deleteBtn = e.target.closest('.delete-task-btn');
      if (deleteBtn) {
        const id = parseInt(deleteBtn.dataset.id, 10);
        showConfirmModal('Bu görevi silmek istediğinize emin misiniz?', () => deleteTask(id));
      }
    });

    $$('[data-period]').forEach((btn) => {
      btn.addEventListener('click', () => {
        $$('[data-period]').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        fetchAnalytics(btn.dataset.period);
      });
    });

    $('#chartPeriod')?.addEventListener('change', async (e) => {
      state.monthlyData = await MockAPI.fetchMonthlyData(parseInt(e.target.value, 10));
      renderPerformanceChart();
    });

    $('#darkModeToggle')?.addEventListener('click', toggleDarkMode);

    $('#settingsDarkMode')?.addEventListener('change', (e) => {
      state.darkMode = e.target.checked;
      saveState(STORAGE_KEYS.darkMode, state.darkMode);
      applyTheme();
      renderPerformanceChart();
    });

    $('#accentColor')?.addEventListener('change', (e) => {
      state.accent = e.target.value;
      saveState(STORAGE_KEYS.accent, state.accent);
      applyTheme();
      renderPerformanceChart();
    });

    $('#fontSize')?.addEventListener('input', (e) => {
      state.fontSize = parseInt(e.target.value, 10);
      saveState(STORAGE_KEYS.fontSize, state.fontSize);
      applyTheme();
    });

    window.addEventListener('resize', () => {
      if (state.currentSection === 'dashboard') {
        renderPerformanceChart();
      }
    });
  };

  // ---------- Public API ----------
  const init = async () => {
    loadState();
    applyTheme();
    setupForms();
    setupEvents();
    navigateTo(state.currentSection);
    await fetchAllData();
  };

  return {
    init,
    getState: () => ({ ...state }),
    setTaskFilters: (filters) => {
      state.taskFilters = { ...state.taskFilters, ...filters };
      renderTasks();
    },
    setUserFilters: (filters) => {
      state.userFilters = { ...state.userFilters, ...filters };
      renderUsers();
    },
    toggleDarkMode,
    navigateTo,
    showAlert,
    renderTasks,
    renderUsers,
  };
})();

document.addEventListener('DOMContentLoaded', () => App.init());

window.App = App;
