/**
 * TaskFlow Pro - jQuery Handlers
 * DOM manipülasyonu, animasyonlar ve etkileşimler
 */

$(document).ready(function () {
  'use strict';

  // ---------- Sidebar Toggle (jQuery animate) ----------
  const $app = $('#app');
  const $sidebar = $('#sidebar');
  const $overlay = $('#sidebarOverlay');

  $('#sidebarToggle').on('click', function () {
    const isMobile = window.innerWidth < 992;

    if (isMobile) {
      $sidebar.toggleClass('mobile-open');
      $overlay.toggleClass('active');
      $(this).attr('aria-expanded', $sidebar.hasClass('mobile-open'));
    } else {
      $app.toggleClass('sidebar-collapsed');
      const collapsed = $app.hasClass('sidebar-collapsed');
      $(this).attr('aria-expanded', !collapsed);

      $sidebar.find('.brand-text, .nav-link span:not(.nav-badge), .sidebar-user-info').animate(
        { opacity: collapsed ? 0 : 1 },
        200
      );
    }
  });

  $('#sidebarClose, #sidebarOverlay').on('click', function () {
    $sidebar.removeClass('mobile-open');
    $overlay.removeClass('active');
    $('#sidebarToggle').attr('aria-expanded', 'false');
  });

  // ---------- Dark Mode (jQuery toggleClass) ----------
  $('#darkModeToggle').on('click', function () {
    const $body = $('body');
    $body.toggleClass('theme-transitioning');

    $('html').toggleClass('dark-mode-active');

    setTimeout(function () {
      $body.removeClass('theme-transitioning');
    }, 300);
  });

  // ---------- Task Search & Filter (jQuery keyup/change) ----------
  $('#taskSearch').on('keyup', function () {
    const searchVal = $(this).val().trim();
    App?.setTaskFilters({ search: searchVal });

  });

  $('#taskStatusFilter, #taskPriorityFilter').on('change', function () {
    App?.setTaskFilters({
      status: $('#taskStatusFilter').val(),
      priority: $('#taskPriorityFilter').val(),
    });
  });

  $('#resetTaskFilters').on('click', function () {
    $('#taskSearch').val('');
    $('#taskStatusFilter').val('all');
    $('#taskPriorityFilter').val('all');
    App?.setTaskFilters({ search: '', status: 'all', priority: 'all' });

    $(this).addClass('btn-success').removeClass('btn-outline-secondary');
    setTimeout(function () {
      $('#resetTaskFilters').removeClass('btn-success').addClass('btn-outline-secondary');
    }, 800);
  });

  // ---------- User Search & Filter ----------
  $('#userSearch').on('keyup', function () {
    App?.setUserFilters({ search: $(this).val().trim() });
  });

  $('#userRoleFilter, #userStatusFilter').on('change', function () {
    App?.setUserFilters({
      role: $('#userRoleFilter').val(),
      status: $('#userStatusFilter').val(),
    });
  });

  // ---------- Global Search ----------
  $('#globalSearch').on('keyup', function () {
    const query = $(this).val().trim().toLowerCase();

    if (query.length < 2) return;

    if (query.includes('görev') || query.includes('task')) {
      App?.navigateTo('tasks');
      $('#taskSearch').val(query.replace(/görev|task/gi, '').trim()).trigger('keyup');
    } else if (query.includes('kullanıcı') || query.includes('user')) {
      App?.navigateTo('users');
      $('#userSearch').val(query.replace(/kullanıcı|user/gi, '').trim()).trigger('keyup');
    }
  });

  // ---------- Form Input Validation (jQuery .val() kontrolü) ----------
  $('#taskTitle, #editTaskTitle').on('keyup', function () {
    const val = $(this).val().trim();
  });

  $('#profileEmail, #userEmail').on('keyup change', function () {
    const $input = $(this);
    const email = $input.val().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email && !emailRegex.test(email)) {
      $input.addClass('is-invalid').removeClass('is-valid');
    } else if (email) {
      $input.addClass('is-valid').removeClass('is-invalid');
    } else {
      $input.removeClass('is-valid is-invalid');
    }
  });

  $('#profilePhone').on('keyup', function () {
    const phone = $(this).val().replace(/\D/g, '');
    if (phone.length >= 10) {
      $(this).addClass('is-valid').removeClass('is-invalid');
    } else if ($(this).val().trim()) {
      $(this).addClass('is-invalid').removeClass('is-valid');
    }
  });

  // ---------- Select All Tasks ----------
  $('#selectAllTasks').on('change', function () {
    const isChecked = $(this).prop('checked');
    $('.task-checkbox').prop('checked', isChecked);

    if (isChecked) {
      $('#tasksTableBody tr').addClass('table-active');
    } else {
      $('#tasksTableBody tr').removeClass('table-active');
    }
  });

  $(document).on('change', '.task-checkbox', function () {
    $(this).closest('tr').toggleClass('table-active', $(this).prop('checked'));

    const total = $('.task-checkbox').length;
    const checked = $('.task-checkbox:checked').length;
    $('#selectAllTasks').prop('checked', total === checked && total > 0);
  });

  // ---------- Table Row Hover Animation ----------
  $(document).on('mouseenter', '#tasksTableBody tr', function () {
    $(this).stop().animate({ backgroundColor: 'rgba(124, 58, 237, 0.06)' }, 150);
  }).on('mouseleave', '#tasksTableBody tr', function () {
    if (!$(this).find('.task-checkbox').prop('checked')) {
      $(this).stop().animate({ backgroundColor: 'transparent' }, 150);
    }
  });

  // ---------- Stat Cards Entrance Animation ----------
  function animateStatCards() {
    $('#statsCards .stat-card').each(function (index) {
      $(this).css({ opacity: 0, transform: 'translateY(20px)' });
      $(this).delay(index * 100).animate(
        { opacity: 1 },
        {
          duration: 400,
          step: function (now) {
            $(this).css('transform', `translateY(${20 * (1 - now)}px)`);
          },
          complete: function () {
            $(this).css({ transform: 'translateY(0)' });
          },
        }
      );
    });
  }

  // ---------- Modal Form Reset ----------
  $('#newTaskModal, #newUserModal').on('hidden.bs.modal', function () {
    $(this).find('form')[0]?.reset();
    $(this).find('form').removeClass('was-validated');
    $(this).find('.is-valid, .is-invalid').removeClass('is-valid is-invalid');
  });

  // ---------- Notification Dropdown Animation ----------
  $('.header-icon-btn[data-bs-toggle="dropdown"]').on('show.bs.dropdown', function () {
    const $menu = $(this).next('.dropdown-menu');
    $menu.css({ opacity: 0, transform: 'translateY(-8px)' });
    $menu.animate(
      { opacity: 1 },
      {
        duration: 200,
        step: function (now) {
          $(this).css('transform', `translateY(${-8 * (1 - now)}px)`);
        },
        complete: function () {
          $(this).css({ transform: 'translateY(0)' });
        },
      }
    );
  });

  // ---------- Accordion Smooth Enhancement ----------
  $('.faq-accordion .accordion-button').on('click', function () {
    const $item = $(this).closest('.accordion-item');
    $('.faq-accordion .accordion-item').not($item).css('opacity', 0.7);
    $item.css('opacity', 1);
  });

  // ---------- Nav Link Ripple Effect ----------
  $('.sidebar-nav .nav-link').on('click', function (e) {
    const $link = $(this);
    const $ripple = $('<span class="nav-ripple"></span>');

    $link.append($ripple);
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);

    $ripple.css({
      width: size,
      height: size,
      left: e.clientX - rect.left - size / 2,
      top: e.clientY - rect.top - size / 2,
    });

    $ripple.addClass('ripple-animate');
    setTimeout(function () {
      $ripple.remove();
    }, 600);
  });

  // ---------- Settings Switches Animation ----------
  $('.form-check-input[type="checkbox"]').on('change', function () {
    const $label = $(this).next('.form-check-label');
    $label.stop().animate({ opacity: 0.5 }, 100).animate({ opacity: 1 }, 100);
  });

  // ---------- Danger Zone Button Confirmation ----------
  $('.danger-zone .btn-danger').on('click', function (e) {
    e.preventDefault();
    const $btn = $(this);
    $btn.prop('disabled', true).text('İşleniyor...');

    setTimeout(function () {
      $btn.prop('disabled', false).text('Hesabı Sil');
      App?.showAlert('Bu özellik demo modunda devre dışıdır.', 'info');
    }, 1000);
  });

  // ---------- Window Resize Handler ----------
  let resizeTimer;
  $(window).on('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (window.innerWidth >= 992) {
        $sidebar.removeClass('mobile-open');
        $overlay.removeClass('active');
      }
    }, 200);
  });

  // ---------- Keyboard Shortcuts ----------
  $(document).on('keydown', function (e) {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'k':
          e.preventDefault();
          $('#globalSearch').focus();
          break;
        case 'd':
          e.preventDefault();
          $('#darkModeToggle').trigger('click');
          break;
        case 'n':
          e.preventDefault();
          bootstrap.Modal.getOrCreateInstance($('#newTaskModal')[0]).show();
          break;
      }
    }

    if (e.key === 'Escape') {
      $sidebar.removeClass('mobile-open');
      $overlay.removeClass('active');
    }
  });

  // ---------- Initialize Animations on Data Load ----------
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.target.id === 'statsCards' && mutation.addedNodes.length) {
        animateStatCards();
      }
    });
  });

  const statsContainer = document.getElementById('statsCards');
  if (statsContainer) {
    observer.observe(statsContainer, { childList: true });
  }

  // ---------- Tooltip Initialization ----------
  $('[data-bs-toggle="tooltip"]').tooltip();

  console.log('%c TaskFlow Pro ', 'background: #7c3aed; color: #fff; padding: 4px 12px; border-radius: 4px; font-weight: bold;', 'jQuery handlers yüklendi.');
});
