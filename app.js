// ════════════════════════════════════════════════════════════════════════════
//  CapMinds – Appointment Scheduler  |  app.js
// ════════════════════════════════════════════════════════════════════════════

let appointments = [];
let editId = null;

function loadData() {
  try {
    const raw = localStorage.getItem('capminds_appointments');
    if (raw) appointments = JSON.parse(raw);
  } catch (e) { appointments = []; }
}

function saveData() {
  try { localStorage.setItem('capminds_appointments', JSON.stringify(appointments)); }
  catch (e) { console.warn('localStorage unavailable'); }
}

const DAYS = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

let calYear = new Date().getFullYear();
let calMonth = new Date().getMonth();
let calView = 'month';

// ─── UTILITY ────────────────────────────────────────────────────────────────

function formatDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function formatTime(t) {
  if (!t) return '';
  const [h, m] = t.split(':');
  const hr = parseInt(h);
  const ampm = hr >= 12 ? 'PM' : 'AM';
  const h12 = hr % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

function formatTimeEnd(t) {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  const end = new Date();
  end.setHours(h, m + 15);
  return formatTime(`${String(end.getHours()).padStart(2, '0')}:${String(end.getMinutes()).padStart(2, '0')}`);
}

function formatDisplayDate(d) {
  const [y, m, day] = d.split('-');
  return `${day}/${m}/${y}`;
}

function escHtml(s) {
  if (!s) return '';
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ─── SIDEBAR ────────────────────────────────────────────────────────────────

const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('mainContent');
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebarBackdrop = document.getElementById('sidebarBackdrop');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
let sidebarCollapsed = false;

function closeMobileSidebar() {
  sidebar.classList.remove('mobile-open');
  sidebarBackdrop.classList.remove('show');
}

sidebarToggle.addEventListener('click', () => {
  if (window.innerWidth <= 900) {
    closeMobileSidebar();
  } else {
    sidebarCollapsed = !sidebarCollapsed;
    sidebar.classList.toggle('collapsed', sidebarCollapsed);
    mainContent.classList.toggle('sidebar-collapsed', sidebarCollapsed);
  }
});

mobileMenuBtn.addEventListener('click', () => {
  sidebar.classList.add('mobile-open');
  sidebarBackdrop.classList.add('show');
});

sidebarBackdrop.addEventListener('click', closeMobileSidebar);

// ─── VIEW SWITCHING ──────────────────────────────────────────────────────────

function switchView(view) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const viewId = 'view' + view.charAt(0).toUpperCase() + view.slice(1);
  const navId = 'nav' + view.charAt(0).toUpperCase() + view.slice(1);
  document.getElementById(viewId).classList.add('active');
  document.getElementById(navId).classList.add('active');
  if (view === 'dashboard') renderDashboard();
  if (view === 'calendar') renderCalendar();
  if (window.innerWidth <= 900) closeMobileSidebar();
}

// ─── CALENDAR RENDER ─────────────────────────────────────────────────────────

function renderCalendar() {
  if (calView === 'week') {
    renderWeek();
    return;
  }
  const grid = document.getElementById('calGrid');
  const label = document.getElementById('calDateLabel');
  label.textContent = `${MONTHS[calMonth]} ${calYear}`;
  grid.innerHTML = '';

  DAYS.forEach((d, i) => {
    const h = document.createElement('div');
    h.className = 'cal-day-header' + (i === 5 ? ' friday' : '');
    h.textContent = d;
    grid.appendChild(h);
  });

  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const daysInPrevMon = new Date(calYear, calMonth, 0).getDate();
  const todayStr = formatDate(new Date());
  const ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  for (let i = 0; i < 35; i++) {
    const cell = document.createElement('div');
    cell.className = 'cal-cell';
    let date, month, year;

    if (i < firstDay) {
      date = daysInPrevMon - firstDay + 1 + i;
      month = calMonth - 1;
      year = calYear;
      if (month < 0) { month = 11; year--; }
      cell.classList.add('other-month');
    } else if (i - firstDay < daysInMonth) {
      date = i - firstDay + 1;
      month = calMonth;
      year = calYear;
    } else {
      date = i - firstDay - daysInMonth + 1;
      month = calMonth + 1;
      year = calYear;
      if (month > 11) { month = 0; year++; }
      cell.classList.add('other-month');
    }

    const cellDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
    if (cellDateStr === todayStr) cell.classList.add('today');

    const numSpan = document.createElement('span');
    numSpan.className = 'cal-date-num';
    numSpan.textContent = date === 1 ? `${ABBR[month]} ${date}` : date;
    cell.appendChild(numSpan);

    appointments.filter(a => a.date === cellDateStr).forEach(appt => {
      const chip = document.createElement('div');
      chip.className = 'appt-chip';
      chip.title = `${appt.patient} – ${appt.doctor} @ ${formatTime(appt.time)}`;
      chip.innerHTML = `
  <div class="chip-row chip-name">
    &#128100; ${escHtml(appt.patient)}
  </div>
  <div class="chip-row chip-meta">
    (${escHtml(appt.status || 'Arrived')}) ${formatTime(appt.time)}
  </div>
  <div class="chip-row chip-actions-row">
    <button class="chip-action-btn" title="Edit" onclick="openEdit('${appt.id}',event)">&#9998;</button>
    <button class="chip-action-btn" title="Delete" onclick="deleteAppt('${appt.id}',event)">&#128465;</button>
    <button class="chip-action-btn" title="View" onclick="viewAppt('${appt.id}',event)">&#128196;</button>
  </div>
`;
      cell.appendChild(chip);
    });

    cell.addEventListener('click', (e) => {
      if (e.target.closest('.chip-action-btn')) return;
      openModal(null, cellDateStr);
    });

    grid.appendChild(cell);
  }
}

document.getElementById('calPrev').addEventListener('click', () => {
  calMonth--;
  if (calMonth < 0) { calMonth = 11; calYear--; }
  renderCalendar();
});

document.getElementById('calNext').addEventListener('click', () => {
  calMonth++;
  if (calMonth > 11) { calMonth = 0; calYear++; }
  renderCalendar();
});

document.getElementById('calToday').addEventListener('click', () => {
  const t = new Date();
  calYear = t.getFullYear();
  calMonth = t.getMonth();
  renderCalendar();
});

document.getElementById('calViewMode').addEventListener('change', (e) => {
  const val = e.target.value;

  if (val === 'month') {
    // ✅ go to current month
    const today = new Date();
    calYear = today.getFullYear();
    calMonth = today.getMonth();
  } else {
    calMonth = Number(val);
  }

  calView = 'month';
  renderCalendar();
});
// ─── DASHBOARD RENDER ────────────────────────────────────────────────────────

function renderDashboard(list) {
  const tbody = document.getElementById('dashTableBody');
  const data = list !== undefined ? list : appointments;
  tbody.innerHTML = '';

  if (data.length === 0) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="7">No appointments found.</td></tr>';
    return;
  }

  data.forEach(a => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="td-patient">${escHtml(a.patient)}</td>
      <td class="td-doctor">${escHtml(a.doctor)}</td>
      <td>${escHtml(a.hospital)}</td>
      <td>${escHtml(a.specialty)}</td>
      <td>${formatDisplayDate(a.date)}</td>
      <td class="td-time">${formatTime(a.time)} – ${formatTimeEnd(a.time)}</td>
      <td>
        <div class="action-btns">
          <button class="action-btn edit" title="Edit" onclick="openEdit('${a.id}')">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button class="action-btn del" title="Delete" onclick="deleteAppt('${a.id}')">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
            </svg>
          </button>
        </div>
      </td>`;
    tbody.appendChild(tr);
  });
}

// ─── FILTERS ─────────────────────────────────────────────────────────────────

function applyFilters() {
  const patient = document.getElementById('filterPatient').value.trim().toLowerCase();
  const doctor = document.getElementById('filterDoctor').value.trim().toLowerCase();
  const from = document.getElementById('filterDateFrom').value;
  const to = document.getElementById('filterDateTo').value;
  const filtered = appointments.filter(a => {
    if (patient && !a.patient.toLowerCase().includes(patient)) return false;
    if (doctor && !a.doctor.toLowerCase().includes(doctor)) return false;
    if (from && a.date < from) return false;
    if (to && a.date > to) return false;
    return true;
  });
  renderDashboard(filtered);
}

document.getElementById('btnUpdate').addEventListener('click', applyFilters);
document.getElementById('filterPatient').addEventListener('input', applyFilters);
document.getElementById('filterDoctor').addEventListener('input', applyFilters);

// ─── MODAL ───────────────────────────────────────────────────────────────────

const overlay = document.getElementById('modalOverlay');
const modalTitle = document.getElementById('modalTitle');

function openModal(id, prefillDate) {
  editId = id || null;
  clearForm();
  if (id) {
    const a = appointments.find(x => x.id === id);
    if (!a) return;
    document.getElementById('fPatient').value = a.patient;
    document.getElementById('fDoctor').value = a.doctor;
    document.getElementById('fHospital').value = a.hospital;
    document.getElementById('fSpecialty').value = a.specialty;
    document.getElementById('fDate').value = a.date;
    document.getElementById('fTime').value = a.time;
    document.getElementById('fReason').value = a.reason || '';
    modalTitle.textContent = 'Edit Appointment';
  } else {
    if (prefillDate) document.getElementById('fDate').value = prefillDate;
    modalTitle.textContent = 'Schedule Appointment';
  }
  overlay.classList.add('open');
  document.getElementById('fPatient').focus();
}

function closeModal() {
  overlay.classList.remove('open');

  // Enable fields again
  ['fPatient','fDoctor','fHospital','fSpecialty','fDate','fTime','fReason']
    .forEach(id => document.getElementById(id).disabled = false);

  document.getElementById('modalSave').style.display = 'inline-block';

  editId = null;
  clearForm();
}

function clearForm() {
  ['fPatient', 'fDoctor', 'fHospital', 'fSpecialty', 'fDate', 'fTime', 'fReason'].forEach(id => {
    const el = document.getElementById(id);
    el.value = '';
    el.classList.remove('error');
  });
  document.querySelectorAll('.error-msg').forEach(e => e.classList.remove('show'));
}

document.getElementById('headerBookBtn').addEventListener('click', () => openModal());
document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalCancel').addEventListener('click', closeModal);
overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });

document.getElementById('modalSave').addEventListener('click', () => {
  const fields = [
    { id: 'fPatient', errId: 'errPatient' },
    { id: 'fDoctor', errId: 'errDoctor' },
    { id: 'fHospital', errId: 'errHospital' },
    { id: 'fSpecialty', errId: 'errSpecialty' },
    { id: 'fDate', errId: 'errDate' },
    { id: 'fTime', errId: 'errTime' },
  ];

  let valid = true;
  fields.forEach(f => {
    const el = document.getElementById(f.id);
    const err = document.getElementById(f.errId);
    if (!el.value.trim()) {
      el.classList.add('error');
      err.classList.add('show');
      valid = false;
    } else {
      el.classList.remove('error');
      err.classList.remove('show');
    }
  });

  if (!valid) return;

  const appt = {
    id: editId || `id_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    patient: document.getElementById('fPatient').value.trim(),
    doctor: document.getElementById('fDoctor').value.trim(),
    hospital: document.getElementById('fHospital').value,
    specialty: document.getElementById('fSpecialty').value,
    date: document.getElementById('fDate').value,
    time: document.getElementById('fTime').value,
    reason: document.getElementById('fReason').value.trim(),
    status: 'Arrived',
  };

  if (editId) {
    const idx = appointments.findIndex(a => a.id === editId);
    if (idx !== -1) appointments[idx] = appt;
    showToast('Appointment updated!', 'green');
  } else {
    appointments.push(appt);
    showToast('Appointment booked!', 'green');
  }

  saveData();
  closeModal();
  renderCalendar();
  if (document.getElementById('viewDashboard').classList.contains('active')) renderDashboard();
});

// ─── APPOINTMENT ACTIONS ─────────────────────────────────────────────────────

function openEdit(id, e) {
  if (e) e.stopPropagation();
  openModal(id);
}

function deleteAppt(id, e) {
  if (e) e.stopPropagation();
  if (!confirm('Delete this appointment?')) return;
  appointments = appointments.filter(a => a.id !== id);
  saveData();
  renderCalendar();
  if (document.getElementById('viewDashboard').classList.contains('active')) renderDashboard();
  showToast('Appointment deleted.', 'red');
}

function viewAppt(id, e) {
  if (e) e.stopPropagation();

  const a = appointments.find(x => x.id === id);
  if (!a) return;

  // Fill modal fields
  document.getElementById('fPatient').value = a.patient;
  document.getElementById('fDoctor').value = a.doctor;
  document.getElementById('fHospital').value = a.hospital;
  document.getElementById('fSpecialty').value = a.specialty;
  document.getElementById('fDate').value = a.date;
  document.getElementById('fTime').value = a.time;
  document.getElementById('fReason').value = a.reason || '';

  // Make fields read-only
  ['fPatient', 'fDoctor', 'fHospital', 'fSpecialty', 'fDate', 'fTime', 'fReason']
    .forEach(id => document.getElementById(id).disabled = true);

  // Change title
  document.getElementById('modalTitle').textContent = 'View Appointment';

  // Hide save button (optional)
  document.getElementById('modalSave').style.display = 'none';

  // Open modal
  document.getElementById('modalOverlay').classList.add('open');
}

// ─── TOAST ───────────────────────────────────────────────────────────────────

function showToast(msg, type) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = `toast show ${type || ''}`;
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ─── SEED DATA ────────────────────────────────────────────────────────────────

function seedData() {
  const today = new Date();
  const y = today.getFullYear(), m = today.getMonth(), d = today.getDate();
  const pad = n => String(n).padStart(2, '0');
  const dt = offset => {
    const nd = new Date(y, m, d + offset);
    return `${nd.getFullYear()}-${pad(nd.getMonth() + 1)}-${pad(nd.getDate())}`;
  };
  appointments = [
    { id: 'seed1', patient: 'Henry James', doctor: 'James Marry', hospital: 'Salus Center (General Hospital)', specialty: 'Dermatology', date: dt(2), time: '09:00', reason: 'Skin rash follow-up', status: 'Arrived' },
    { id: 'seed2', patient: 'Henry James', doctor: 'James Marry', hospital: 'Ultracare (General Hospital)', specialty: 'Dermatology', date: dt(5), time: '11:30', reason: 'Annual checkup', status: 'Arrived' },
  ];
  saveData();
}

// ─── INIT ─────────────────────────────────────────────────────────────────────

loadData();

if (appointments.length === 0) {
  seedData();
}

renderCalendar();
renderDashboard();
function renderWeek() {
  const grid = document.getElementById('calGrid');
  const label = document.getElementById('calDateLabel');

  grid.innerHTML = '';
  label.textContent = 'This Week';

  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - today.getDay());

  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);

    const cell = document.createElement('div');
    cell.className = 'cal-cell';

    const dateStr = formatDate(d);

    cell.innerHTML = `<span class="cal-date-num">${d.getDate()}</span>`;

    appointments
      .filter(a => a.date === dateStr)
      .forEach(appt => {
        const chip = document.createElement('div');
        chip.className = 'appt-chip';
        chip.textContent = `${appt.patient} ${formatTime(appt.time)}`;
        cell.appendChild(chip);
      });

    grid.appendChild(cell);
  }
}