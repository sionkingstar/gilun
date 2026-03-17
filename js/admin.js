// 2026 길운 달력 - 관리자 페이지 (localStorage 버전)

let customers = [];
let editMode = false;
const FIXED_YEAR = 2026;
const ADMIN_PASSWORD = 'admin2026';

document.addEventListener('DOMContentLoaded', function () {
    checkAdminLogin();
});

function checkAdminLogin() {
    const isLoggedIn = sessionStorage.getItem('admin_logged_in');
    if (isLoggedIn === 'true') {
        showAdminContent();
    } else {
        document.getElementById('loginScreen').classList.remove('hidden');
        document.getElementById('adminContent').classList.add('hidden');
    }
}

function adminLogin() {
    const password = document.getElementById('adminPassword').value;
    if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem('admin_logged_in', 'true');
        showAdminContent();
    } else {
        document.getElementById('loginError').classList.remove('hidden');
        document.getElementById('adminPassword').value = '';
    }
}

function showAdminContent() {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('adminContent').classList.remove('hidden');
    loadCustomers();
    document.getElementById('customerForm').addEventListener('submit', handleFormSubmit);
}

function adminLogout() {
    sessionStorage.removeItem('admin_logged_in');
    window.location.reload();
}

// localStorage 데이터 관리
function loadCustomers() {
    try {
        const stored = localStorage.getItem('saju_customers');
        customers = stored ? JSON.parse(stored) : [];
        renderCustomerTable();
        updateCustomerCount();
    } catch (error) {
        console.error('Error loading customers:', error);
        customers = [];
    }
}

function saveCustomers() {
    try {
        localStorage.setItem('saju_customers', JSON.stringify(customers));
        return true;
    } catch (error) {
        console.error('Error saving:', error);
        showToast('저장 실패', 'error');
        return false;
    }
}

function renderCustomerTable(filteredCustomers = null) {
    const data = filteredCustomers || customers;
    const tbody = document.getElementById('customerTableBody');
    const emptyState = document.getElementById('emptyState');

    if (data.length === 0) {
        tbody.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');
    tbody.innerHTML = data.map(customer => {
        const createdDate = customer.created_at ? new Date(customer.created_at).toLocaleDateString('ko-KR') : '-';
        return `
            <tr class="hover:bg-gray-50">
                <td class="px-4 py-3">
                    <div class="font-medium text-gray-900">${escapeHtml(customer.name)}</div>
                    <div class="text-sm text-gray-500">${escapeHtml(customer.gender || '-')}</div>
                </td>
                <td class="px-4 py-3 text-sm text-gray-600">${escapeHtml(customer.birth_info || '-')}</td>
                <td class="px-4 py-3">
                    <code class="bg-purple-100 text-purple-700 px-2 py-1 rounded text-sm">${escapeHtml(customer.token)}</code>
                </td>
                <td class="px-4 py-3 text-sm text-gray-600">${createdDate}</td>
                <td class="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">${escapeHtml(customer.memo || '-')}</td>
                <td class="px-4 py-3">
                    <div class="flex items-center justify-center gap-2">
                        <button onclick="openPreviewModal('${customer.id}')" class="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg" title="미리보기 & PDF">
                            <i class="fas fa-calendar-alt"></i>
                        </button>
                        <button onclick="openEditModal('${customer.id}')" class="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="편집">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="openDeleteModal('${customer.id}')" class="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="삭제">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function updateCustomerCount() {
    document.getElementById('customerCount').innerHTML = `<i class="fas fa-users mr-1"></i>고객 ${customers.length}명`;
}

function searchCustomers() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    if (!query) {
        renderCustomerTable();
        return;
    }
    const filtered = customers.filter(c => c.name.toLowerCase().includes(query) || c.token.toLowerCase().includes(query));
    renderCustomerTable(filtered);
}

function openAddModal() {
    editMode = false;
    document.getElementById('modalTitle').textContent = '새 고객 등록';
    document.getElementById('customerForm').reset();
    document.getElementById('customerId').value = '';

    // Reset calendar type
    document.querySelector('input[name="calendarType"][value="solar"]').checked = true;
    document.getElementById('isLeapMonth').checked = false;
    toggleLeapMonth();

    document.getElementById('customerModal').classList.remove('hidden');
}

function openEditModal(customerId) {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;

    editMode = true;
    document.getElementById('modalTitle').textContent = '고객 정보 수정';
    document.getElementById('customerId').value = customer.id;
    document.getElementById('customerName').value = customer.name || '';

    if (customer.birth_info) {
        // 형식: YYYY-MM-DD (음력, 윤달) HH:mm
        const dateMatch = customer.birth_info.match(/^(\d{4}-\d{2}-\d{2})/);
        const timeMatch = customer.birth_info.match(/\s(\d{2}:\d{2})$/);

        document.getElementById('birthDate').value = dateMatch ? dateMatch[1] : '';
        document.getElementById('birthTime').value = timeMatch ? timeMatch[1] : '';

        // 양력/음력 설정
        const isLunar = customer.birth_info.includes('(음력');
        const isLeap = customer.birth_info.includes('윤달');

        document.querySelector('input[name="calendarType"][value="lunar"]').checked = isLunar;
        document.querySelector('input[name="calendarType"][value="solar"]').checked = !isLunar;
        document.getElementById('isLeapMonth').checked = isLeap;

        toggleLeapMonth();
    }

    document.getElementById('customerGender').value = customer.gender || '여성';
    document.getElementById('customerToken').value = customer.token || '';
    document.getElementById('sajuData').value = customer.saju_data || '';
    document.getElementById('customerMemo').value = customer.memo || '';
    document.getElementById('customerModal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('customerModal').classList.add('hidden');
}

function toggleLeapMonth() {
    const isLunar = document.querySelector('input[name="calendarType"][value="lunar"]').checked;
    const leapCheckbox = document.getElementById('isLeapMonth');
    const leapLabel = document.getElementById('leapMonthLabel');

    if (isLunar) {
        leapCheckbox.disabled = false;
        leapLabel.classList.remove('text-gray-400');
        leapLabel.classList.add('text-gray-700');
    } else {
        leapCheckbox.disabled = true;
        leapCheckbox.checked = false;
        leapLabel.classList.add('text-gray-400');
        leapLabel.classList.remove('text-gray-700');
    }
}

function generateTokenFromBirth() {
    const birthDate = document.getElementById('birthDate').value;
    if (birthDate) {
        document.getElementById('customerToken').value = birthDate.replace(/-/g, '');
    }
}

function handleFormSubmit(e) {
    e.preventDefault();

    const customerId = document.getElementById('customerId').value;
    const name = document.getElementById('customerName').value.trim();
    const birthDate = document.getElementById('birthDate').value;
    const birthTime = document.getElementById('birthTime').value;
    const gender = document.getElementById('customerGender').value;
    const token = document.getElementById('customerToken').value.trim();
    const sajuData = document.getElementById('sajuData').value.trim();
    const memo = document.getElementById('customerMemo').value.trim();

    // 양력/음력 정보 가져오기
    const calendarType = document.querySelector('input[name="calendarType"]:checked').value;
    const isLeapMonth = document.getElementById('isLeapMonth').checked;

    let birthInfo = birthDate;

    // 괄호 정보 추가
    if (calendarType === 'lunar') {
        birthInfo += ` (음력${isLeapMonth ? ', 윤달' : ''})`;
    } else {
        birthInfo += ' (양력)';
    }

    if (birthTime) birthInfo += ' ' + birthTime;

    if (!name || !birthDate || !sajuData) {
        showToast('필수 항목을 모두 입력해주세요', 'error');
        return;
    }

    try {
        JSON.parse(sajuData);
    } catch (e) {
        console.error('JSON 파싱 오류:', e);
        showToast('JSON 오류: ' + e.message, 'error');
        return;
    }

    const existingCustomer = customers.find(c => c.token === token && c.id !== customerId);
    if (existingCustomer) {
        showToast('이미 사용 중인 토큰입니다', 'error');
        return;
    }

    if (editMode && customerId) {
        const index = customers.findIndex(c => c.id === customerId);
        if (index !== -1) {
            customers[index] = { ...customers[index], name, birth_info: birthInfo, gender, token, saju_data: sajuData, memo, updated_at: new Date().toISOString() };
        }
    } else {
        customers.push({
            id: 'cust_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            name, birth_info: birthInfo, gender, token, saju_data: sajuData, memo,
            created_at: new Date().toISOString()
        });
    }

    if (saveCustomers()) {
        showToast(editMode ? '수정되었습니다' : '등록되었습니다', 'success');
        closeModal();
        renderCustomerTable();
        updateCustomerCount();

        if (!editMode) {
            const newCustomer = customers[customers.length - 1];
            setTimeout(() => openPreviewModal(newCustomer.id), 500);
        }
    }
}

function openDeleteModal(customerId) {
    document.getElementById('deleteCustomerId').value = customerId;
    document.getElementById('deleteModal').classList.remove('hidden');
}

function closeDeleteModal() {
    document.getElementById('deleteModal').classList.add('hidden');
}

function confirmDelete() {
    const customerId = document.getElementById('deleteCustomerId').value;
    const index = customers.findIndex(c => c.id === customerId);
    if (index !== -1) {
        customers.splice(index, 1);
        if (saveCustomers()) {
            showToast('삭제되었습니다', 'success');
            closeDeleteModal();
            renderCustomerTable();
            updateCustomerCount();
        }
    }
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    toastMessage.textContent = message;
    toast.className = 'fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50';
    toast.classList.add(type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-gray-800', 'text-white');
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 3000);
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 미리보기 & PDF
function openPreviewModal(customerId) {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) { showToast('고객을 찾을 수 없습니다', 'error'); return; }

    try {
        const sajuData = JSON.parse(customer.saju_data);
        document.getElementById('previewContent').innerHTML = generateFullCalendarPreview(customer, sajuData, FIXED_YEAR);
        document.getElementById('previewCustomerId').value = customerId;
        document.getElementById('previewModal').classList.remove('hidden');
    } catch (error) {
        console.error('Preview error:', error);
        showToast('데이터 형식 오류: ' + error.message, 'error');
    }
}

function closePreviewModal() {
    document.getElementById('previewModal').classList.add('hidden');
}


async function downloadPreviewPDF() {
    const customerId = document.getElementById('previewCustomerId').value;
    const customer = customers.find(c => c.id === customerId);
    if (!customer) { showToast('고객을 찾을 수 없습니다', 'error'); return; }

    let container = null;

    try {
        const sajuData = JSON.parse(customer.saju_data);
        const pillars = SajuCalendar.correctPillars(sajuData, customer.birth_info);
        const daeunData = SajuCalendar.getDaeun(sajuData);
        const sewunData = SajuCalendar.getSewun(sajuData);
        
        const sewun = (sewunData.data || []).find(s => s.연도 === FIXED_YEAR);
        const currentDaeun = (daeunData.data || []).find(d => d.연도 <= FIXED_YEAR && d.연도 + 10 > FIXED_YEAR);
        const ilgan = SajuCalendar.getIlgan(sajuData);

        // jsPDF 초기화 (가로 A4)
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('l', 'mm', 'a4'); // 'l' for landscape
        const pageWidth = 297; // A4 landscape width in mm
        const pageHeight = 210; // A4 landscape height in mm

        // A4 픽셀 크기 (96 DPI 기준)
        const a4WidthPx = 1123; // 297mm * 96dpi / 25.4mm/inch
        const a4HeightPx = 794; // 210mm * 96dpi / 25.4mm/inch

        // 임시 컨테이너 (화면 밖 고정 크기)
        container = document.createElement('div');
        container.style.cssText = `position:fixed; top:-9999px; left:-9999px; width:${a4WidthPx}px; height:${a4HeightPx}px; background:white; z-index:-1; font-family:'Noto Sans KR', sans-serif; box-sizing:border-box; overflow:hidden;`;
        document.body.appendChild(container);

        // 총 페이지: 1(표지) + 12(월별)
        const totalPages = 13;

        // --- 1. 표지 생성 ---
        showToast(`PDF 생성 중... (1/${totalPages})`, 'info');
        container.innerHTML = generatePDFCoverPage(customer, sajuData, FIXED_YEAR, currentDaeun, sewun, daeunData);
        await new Promise(r => setTimeout(r, 500)); // 렌더링 안정화 대기

        let canvas = await html2canvas(container, {
            scale: 2, // 고해상도 렌더링
            useCORS: true,
            logging: false,
            width: a4WidthPx,
            height: a4HeightPx,
            windowWidth: a4WidthPx, // html2canvas가 렌더링할 뷰포트 너비
            windowHeight: a4HeightPx, // html2canvas가 렌더링할 뷰포트 높이
            scrollY: -window.scrollY, // 현재 스크롤 위치 보정
            scrollX: -window.scrollX
        });
        let imgData = canvas.toDataURL('image/jpeg', 0.9); // JPEG 압축
        pdf.addImage(imgData, 'JPEG', 0, 0, pageWidth, pageHeight); // PDF 페이지에 이미지 추가

        const sewunOrData = (sewun && sewun.월운) ? sewun : sewunData;
        const monthlyLuckArray = sewunOrData.월운;
        
        if (monthlyLuckArray) {
            for (let m = 1; m <= 12; m++) {
                showToast(`PDF 생성 중... (${m + 1}/${totalPages})`, 'info');

                let monthData = SajuCalendar.getMonthData(sewunOrData, FIXED_YEAR, m);

                if (monthData) {
                    pdf.addPage();
                    container.innerHTML = generatePDFMonthPage(FIXED_YEAR, m, monthData, ilgan);
                    await new Promise(r => setTimeout(r, 300));

                    canvas = await html2canvas(container, {
                        scale: 2,
                        useCORS: true,
                        logging: false,
                        width: a4WidthPx,
                        height: a4HeightPx,
                        windowWidth: a4WidthPx,
                        windowHeight: a4HeightPx,
                        scrollY: -window.scrollY,
                        scrollX: -window.scrollX
                    });
                    imgData = canvas.toDataURL('image/jpeg', 0.9);
                    pdf.addImage(imgData, 'JPEG', 0, 0, pageWidth, pageHeight);
                }
            }
        }

        // PDF 저장
        pdf.save(`${customer.name}_${FIXED_YEAR}년_길운달력.pdf`);
        showToast('PDF 저장 완료!', 'success');

    } catch (error) {
        console.error('PDF error:', error);
        showToast('PDF 생성 오류: ' + error.message, 'error');
    } finally {
        if (container && document.body.contains(container)) {
            document.body.removeChild(container);
        }
    }
}

// PDF 표지 페이지 HTML
function generatePDFCoverPage(customer, sajuData, year, currentDaeun, sewun, daeunData) {
    const pillars = SajuCalendar.correctPillars(sajuData, customer.birth_info);

    const pillarsHtml = pillars.map(p => {
        const title = p.title || '';
        const name = title.split(' ')[0] || '';
        const ganji = p.ganji || '??';
        const sipseong = (p.cheon_sip || p.sipseong || '') + (p.ji_sip ? '/' + p.ji_sip : '');

        return `<div style="background:linear-gradient(180deg,#1e1b4b,#312e81);border-radius:12px;padding:16px;text-align:center;color:white;min-width:90px;">
            <div style="font-size:12px;color:#c4b5fd;margin-bottom:6px;">${name}</div>
            <div style="font-family:'Noto Serif KR',serif;font-size:40px;font-weight:900;">${ganji[0] || '?'}</div>
            <div style="font-family:'Noto Serif KR',serif;font-size:40px;font-weight:900;">${ganji[1] || '?'}</div>
            <div style="font-size:11px;color:#c4b5fd;margin-top:6px;">${sipseong.split('/')[0] || '-'}</div>
        </div>`;
    }).join('');

    // Layout Fix: Use gap instead of space-between and remove height:100% constraint that causes overlap
    return `<div style="font-family:'Noto Sans KR',sans-serif;background:white;width:100%;height:100%;padding:40px;box-sizing:border-box;display:flex;flex-direction:column;gap:25px;">
        <div style="text-align:center;margin-bottom:10px;">
            <div style="width:80px;height:80px;background:linear-gradient(135deg,#7c3aed,#4338ca);border-radius:50%;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;">
                <div style="color:white;text-align:center;"><div style="font-size:12px;">사주명가</div><div style="font-size:20px;font-weight:bold;">대운</div></div>
            </div>
            <h1 style="font-size:36px;font-weight:800;color:#1f2937;margin:0;">${year}년 길운 달력</h1>
            <p style="color:#6b7280;font-size:18px;margin:12px 0 0;">${customer.name}님의 개인 맞춤 운세 캘린더</p>
        </div>
        
        <div style="background:#f9fafb;border-radius:12px;padding:25px;">
            <h2 style="font-size:16px;font-weight:bold;color:#374151;margin:0 0 12px;">📋 기본 정보</h2>
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;">
                <div style="background:white;padding:12px;border-radius:8px;"><div style="font-size:12px;color:#6b7280;">생년월일시</div><div style="font-size:16px;font-weight:bold;margin-top:4px;">${customer.birth_info}</div></div>
                <div style="background:white;padding:12px;border-radius:8px;"><div style="font-size:12px;color:#6b7280;">일간(본인)</div><div style="font-size:16px;font-weight:bold;margin-top:4px;">${SajuCalendar.getIlgan(sajuData)}</div></div>
                <div style="background:white;padding:12px;border-radius:8px;"><div style="font-size:12px;color:#6b7280;">성별</div><div style="font-size:16px;font-weight:bold;margin-top:4px;">${customer.gender}</div></div>
                <div style="background:white;padding:12px;border-radius:8px;"><div style="font-size:12px;color:#6b7280;">대운방향</div><div style="font-size:16px;font-weight:bold;margin-top:4px;">${daeunData.direction || '-'}</div></div>
            </div>
        </div>
        
        <div style="flex-grow:1;">
            <h2 style="font-size:16px;font-weight:bold;color:#374151;margin:0 0 12px;">🔮 사주팔자</h2>
            <div style="display:flex;gap:12px;justify-content:center;">${pillarsHtml}</div>
        </div>
        
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
            ${currentDaeun ? `<div style="background:linear-gradient(135deg,#ede9fe,#e0e7ff);border-radius:12px;padding:20px;">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                    <div><h3 style="font-size:16px;font-weight:bold;color:#5b21b6;margin:0 0 6px;">⭐ 현재 대운 (${currentDaeun.연도}~${currentDaeun.연도 + 9})</h3><div style="font-size:13px;color:#6b7280;">십성: ${currentDaeun.십성} · 신살: ${currentDaeun.신살}</div></div>
                    <span style="font-family:'Noto Serif KR',serif;font-size:42px;font-weight:900;color:#4c1d95;">${currentDaeun.간지}</span>
                </div>
            </div>` : ''}
            ${sewun ? `<div style="background:#f0fdf4;border-radius:12px;padding:20px;">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                    <div><h3 style="font-size:16px;font-weight:bold;color:#166534;margin:0 0 6px;">📅 ${year}년 세운</h3><div style="font-size:13px;color:#6b7280;">세운십성: ${sewun.세운십성} · 신살: ${sewun.세운신살 || '-'}</div></div>
                    <span style="font-family:'Noto Serif KR',serif;font-size:42px;font-weight:900;color:#166534;">${sewun.세운간지}</span>
                </div>
            </div>` : ''}
        </div>
        
        <div style="padding:14px;background:#f3f4f6;border-radius:10px;font-size:13px;text-align:center;">
             <div style="margin-bottom:8px;">
                <strong>길운 표시:</strong> 
                <span style="margin-left:20px;color:#f59e0b;">★ 대길</span> · 
                <span style="color:#22c55e;">◎ 길</span> · 
                <span style="color:#6b7280;">○ 평</span> · 
                <span style="color:#ef4444;">△ 주의</span>
            </div>
            <div>
                <strong>일별 운세:</strong> 
                <span style="margin-left:10px;">💰재물 📈사업 ✈️이동 🤝귀인 📝문서 ⭐인기 📚학습 🤲협력 🔄변화 ⚠️건강주의</span>
            </div>
        </div>
    </div>`;
}

// PDF 월별 페이지 HTML
function generatePDFMonthPage(year, month, monthData, ilgan) {
    const mainSipseong = monthData.십성.split('/')[0];
    const luckInfo = sipseongMeaning[mainSipseong] || { luck: 'normal', keyword: '-', advice: '-' };

    let headerBg = luckInfo.luck === 'great' ? 'linear-gradient(135deg,#fef3c7,#fde68a)' :
        luckInfo.luck === 'good' ? 'linear-gradient(135deg,#dcfce7,#bbf7d0)' :
            luckInfo.luck === 'caution' ? 'linear-gradient(135deg,#fee2e2,#fecaca)' : '#f9fafb';
    let borderColor = luckInfo.luck === 'great' ? '#f59e0b' : luckInfo.luck === 'good' ? '#22c55e' : luckInfo.luck === 'caution' ? '#ef4444' : '#9ca3af';

    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const startDayOfWeek = firstDay.getDay();
    const totalDays = lastDay.getDate();

    // 요일 헤더
    let cells = ['일', '월', '화', '수', '목', '금', '토'].map((d, i) =>
        `<div style="text-align:center;font-size:14px;font-weight:bold;padding:4px;color:${i === 0 ? '#dc2626' : i === 6 ? '#2563eb' : '#374151'};background:#f3f4f6;border-radius:4px;">${d}</div>`
    ).join('');

    // 빈 셀
    for (let i = 0; i < startDayOfWeek; i++) {
        cells += '<div style="background:#fafafa;min-height:55px;border-radius:4px;"></div>';
    }

    // 날짜 셀
    for (let day = 1; day <= totalDays; day++) {
        const dayOfWeek = new Date(year, month - 1, day).getDay();
        const ganji = SajuCalendar.getDailyGanji(year, month, day);
        const dayLuck = SajuCalendar.calculateDailyLuck(ilgan, ganji, monthData);
        const issues = SajuCalendar.getDailyIssues(ilgan, ganji, monthData);

        let bgColor = dayLuck.luck === 'great' ? '#fef3c7' : dayLuck.luck === 'good' ? '#dcfce7' : dayLuck.luck === 'caution' ? '#fee2e2' : '#ffffff';
        let textColor = dayOfWeek === 0 ? '#dc2626' : dayOfWeek === 6 ? '#2563eb' : '#1f2937';
        let leftBorder = dayLuck.luck === 'great' ? '3px solid #f59e0b' : dayLuck.luck === 'good' ? '3px solid #22c55e' : dayLuck.luck === 'caution' ? '3px solid #ef4444' : '3px solid #e5e7eb';

        let issueIcons = issues.slice(0, 3).map(i => i.icon).join('');

        cells += `<div style="background:${bgColor};min-height:55px;border-radius:4px;padding:4px;border-left:${leftBorder};display:flex;flex-direction:column;justify-content:space-between;">
            <div style="display:flex;justify-content:space-between;align-items:center;">
                <span style="font-weight:bold;font-size:15px;color:${textColor};">${day}</span>
                <span style="font-size:13px;">${dayLuck.symbol}</span>
            </div>
            <div style="font-family:'Noto Serif KR',serif;font-size:15px;font-weight:700;color:#374151;text-align:center;">${ganji}</div>
            <div style="font-size:11px;text-align:right;height:14px;">${issueIcons}</div>
        </div>`;
    }

    return `<div style="font-family:'Noto Sans KR',sans-serif;background:white;width:100%;height:100%;padding:15px;box-sizing:border-box;display:flex;flex-direction:column;">
        <!-- 월 헤더 -->
        <div style="background:${headerBg};border-radius:12px;padding:12px 15px;margin-bottom:8px;border-left:5px solid ${borderColor};flex-shrink:0;">
            <div style="display:flex;justify-content:space-between;align-items:center;">
                <div>
                    <div style="font-size:13px;color:#6b7280;">${year}년</div>
                    <div style="font-size:28px;font-weight:800;color:#1f2937;">${month}월</div>
                </div>
                <div style="text-align:center;">
                    <div style="font-family:'Noto Serif KR',serif;font-size:36px;font-weight:900;color:#4c1d95;">${monthData.간지}</div>
                    <div style="font-size:13px;color:#6b7280;">${monthData.십성}</div>
                </div>
                <div style="text-align:right;">
                    <div style="font-size:16px;font-weight:bold;color:#7c3aed;">${luckInfo.keyword}</div>
                    <div style="font-size:12px;color:#6b7280;max-width:180px;">${luckInfo.advice}</div>
                </div>
            </div>
        </div>
        
        <!-- 달력 그리드 (공간 채우기) -->
        <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;flex-grow:1;">
            ${cells}
        </div>
        
        <!-- 하단 범례 (고정) -->
        <div style="margin-top:5px;padding:6px;background:#f3f4f6;border-radius:8px;display:flex;justify-content:center;gap:10px;font-size:9px;flex-wrap:wrap;flex-shrink:0;">
            <span>★대길</span><span>◎길</span><span>○평</span><span>△주의</span>
            <span style="margin-left:12px;">💰재물 📈사업 ✈️이동 🤝귀인 📝문서 ⭐인기 📚학습 🤲협력 🔄변화 ⚠️건강주의</span>
        </div>
    </div>`;
}

const sipseongMeaning = {
    '비견': { luck: 'normal', keyword: '경쟁/협력', advice: '동료와의 협력이 중요' },
    '겁재': { luck: 'caution', keyword: '경쟁/소비', advice: '지출에 주의' },
    '식신': { luck: 'great', keyword: '재능/건강', advice: '창작에 좋은 시기' },
    '상관': { luck: 'good', keyword: '표현/변화', advice: '새로운 시도 유리' },
    '편재': { luck: 'great', keyword: '투자/사업', advice: '재물운 활발' },
    '정재': { luck: 'great', keyword: '안정/저축', advice: '안정적 수입' },
    '편관': { luck: 'caution', keyword: '변화/도전', advice: '급변에 대비' },
    '정관': { luck: 'good', keyword: '승진/명예', advice: '인정받는 시기' },
    '편인': { luck: 'good', keyword: '학습/자격', advice: '자기계발에 좋음' },
    '정인': { luck: 'great', keyword: '문서/계약', advice: '계약에 유리' }
};

function getLuckLabel(luck) {
    return luck === 'great' ? '★대길' : luck === 'good' ? '◎길' : luck === 'caution' ? '△주의' : '○평';
}

function generateFullCalendarPreview(customer, sajuData, year) {
    const pillars = SajuCalendar.correctPillars(sajuData, customer.birth_info);
    const daeunData = SajuCalendar.getDaeun(sajuData);
    const sewunData = SajuCalendar.getSewun(sajuData);
    
    const sewun = (sewunData.data || []).find(s => s.연도 === year);
    const currentDaeun = (daeunData.data || []).find(d => d.연도 <= year && d.연도 + 10 > year);
    const ilgan = SajuCalendar.getIlgan(sajuData);

    const pillarsHtml = pillars.map(p => {
        const title = p.title || '';
        const name = title.split(' ')[0] || '';
        const ganji = p.ganji || '??';
        const sipseong = (p.cheon_sip || p.sipseong || '-') + (p.ji_sip ? '/' + p.ji_sip : '');

        return `<div class="pillar-box text-center text-white" style="min-width:70px;">
            <div class="text-xs text-purple-300 mb-1">${name}</div>
            <div class="font-serif text-2xl font-black">${ganji[0] || '?'}</div>
            <div class="font-serif text-2xl font-black">${ganji[1] || '?'}</div>
            <div class="text-xs text-purple-300 mt-1">${sipseong.split('/')[0]}</div>
        </div>`;
    }).join('');

    let calendarsHtml = '';
    const sewunOrData = (sewun && sewun.월운) ? sewun : sewunData;
    const monthlyLuckArray = sewunOrData.월운;
    
    if (monthlyLuckArray) {
        for (let m = 1; m <= 12; m++) {
            let monthData = SajuCalendar.getMonthData(sewunOrData, year, m);
            if (monthData) calendarsHtml += generateMonthCalendarHtml(year, m, monthData, sajuData.user_info);
        }
    }

    return `<div class="bg-white">
        <div class="gradient-bg text-white p-6 rounded-t-xl">
            <div class="flex items-center gap-4">
                <div class="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                    <div class="text-center"><p class="text-xs">사주명가</p><p class="text-lg font-bold">대운</p></div>
                </div>
                <div>
                    <h1 class="text-2xl font-bold">${year}년 길운 달력</h1>
                    <p class="text-purple-200">${customer.name}님의 개인 맞춤 운세</p>
                </div>
            </div>
        </div>
        <div class="p-6 border-b">
            <div class="flex flex-wrap gap-6">
                <div><h3 class="text-sm font-bold text-gray-600 mb-3">사주팔자</h3><div class="flex gap-2">${pillarsHtml}</div></div>
                <div class="flex-grow">
                    <h3 class="text-sm font-bold text-gray-600 mb-3">기본 정보</h3>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div class="bg-gray-50 p-3 rounded-lg"><div class="text-gray-500">생년월일시</div><div class="font-medium">${customer.birth_info || '-'}</div></div>
                        <div class="bg-gray-50 p-3 rounded-lg"><div class="text-gray-500">일간</div><div class="font-medium">${SajuCalendar.getIlgan(sajuData)}</div></div>
                        <div class="bg-gray-50 p-3 rounded-lg"><div class="text-gray-500">성별</div><div class="font-medium">${customer.gender}</div></div>
                        <div class="bg-gray-50 p-3 rounded-lg"><div class="text-gray-500">대운방향</div><div class="font-medium">${daeunData.direction || '-'}</div></div>
                    </div>
                    ${currentDaeun ? `<div class="mt-4 bg-purple-50 p-4 rounded-lg flex justify-between items-center">
                        <div><span class="text-purple-700 font-bold">현재 대운</span><span class="text-gray-500 text-sm ml-2">(${currentDaeun.연도}~${currentDaeun.연도 + 9})</span></div>
                        <span class="font-serif text-3xl font-black text-purple-800">${currentDaeun.간지}</span>
                    </div>` : ''}
                    ${sewun ? `<div class="mt-3 bg-indigo-50 p-4 rounded-lg flex justify-between items-center">
                        <div><span class="text-indigo-700 font-bold">${year}년 세운</span><span class="text-gray-500 text-sm ml-2">${sewun.세운십성}</span></div>
                        <span class="font-serif text-3xl font-black text-indigo-800">${sewun.세운간지}</span>
                    </div>` : ''}
                </div>
            </div>
        </div>
        <div class="p-4 bg-gray-50 border-b">
            <div class="flex flex-wrap items-center gap-4 text-sm">
                <span class="font-bold text-gray-600">길운 표시:</span>
                <span class="flex items-center gap-1"><span class="w-6 h-6 rounded luck-great flex items-center justify-center text-sm font-bold">★</span> 대길</span>
                <span class="flex items-center gap-1"><span class="w-6 h-6 rounded luck-good flex items-center justify-center text-sm font-bold">◎</span> 길</span>
                <span class="flex items-center gap-1"><span class="w-6 h-6 rounded luck-normal flex items-center justify-center text-sm font-bold border">○</span> 평</span>
                <span class="flex items-center gap-1"><span class="w-6 h-6 rounded luck-caution flex items-center justify-center text-sm font-bold">△</span> 주의</span>
            </div>
        </div>
        <div class="p-6"><div class="grid grid-cols-1 md:grid-cols-2 gap-6">${calendarsHtml}</div></div>
    </div>`;
}

function generateMonthCalendarHtml(year, month, monthData, userInfo) {
    const mainSipseong = monthData.십성.split('/')[0];
    const luckInfo = sipseongMeaning[mainSipseong] || { luck: 'normal', keyword: '-', advice: '-' };
    let themeClass = luckInfo.luck === 'great' || luckInfo.luck === 'good' ? 'month-theme-good' : luckInfo.luck === 'caution' ? 'month-theme-caution' : 'month-theme-normal';

    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const startDayOfWeek = firstDay.getDay();
    const totalDays = lastDay.getDate();
    const ilgan = SajuCalendar.getIlgan({ user_info: userInfo }); // partial sajuData

    let cells = '';
    for (let i = 0; i < startDayOfWeek; i++) cells += '<div class="calendar-cell empty"></div>';

    for (let day = 1; day <= totalDays; day++) {
        const dayOfWeek = new Date(year, month - 1, day).getDay();
        const ganji = SajuCalendar.getDailyGanji(year, month, day);
        const dayLuck = SajuCalendar.calculateDailyLuck(ilgan, ganji, monthData);
        const issues = SajuCalendar.getDailyIssues(ilgan, ganji, monthData);

        let dayClass = 'calendar-cell' + (dayOfWeek === 0 ? ' sunday' : dayOfWeek === 6 ? ' saturday' : '');
        dayClass += dayLuck.luck === 'great' ? ' luck-great' : dayLuck.luck === 'good' ? ' luck-good' : dayLuck.luck === 'caution' ? ' luck-caution' : ' luck-normal';

        let issueHtml = issues.length > 0 ? '<div class="issues-container">' + issues.slice(0, 3).map(i => `<span class="issue-tag bg-white/70">${i.icon}</span>`).join('') + '</div>' : '';

        cells += `<div class="${dayClass}">
            <div class="flex justify-between items-start"><span class="day-number">${day}</span><span class="luck-symbol">${dayLuck.symbol}</span></div>
            <div class="ganji">${ganji}</div>${issueHtml}
        </div>`;
    }

    const luckBadgeClass = luckInfo.luck === 'great' ? 'bg-yellow-200 text-yellow-800' : luckInfo.luck === 'good' ? 'bg-green-200 text-green-800' : luckInfo.luck === 'caution' ? 'bg-red-200 text-red-800' : 'bg-gray-200 text-gray-700';

    return `<div class="border rounded-xl overflow-hidden ${themeClass}">
        <div class="p-4 border-b bg-white/50">
            <div class="flex justify-between items-center">
                <div><span class="text-xl font-bold">${month}월</span><span class="font-serif text-lg ml-2">${monthData.간지}</span></div>
                <span class="text-sm px-3 py-1 rounded-full ${luckBadgeClass}">${luckInfo.keyword}</span>
            </div>
            <p class="text-sm text-gray-600 mt-1">${luckInfo.advice}</p>
        </div>
        <div class="p-3 bg-white">
            <div class="grid grid-cols-7 gap-1 text-center text-sm font-medium text-gray-500 mb-2">
                <div class="text-red-500">일</div><div>월</div><div>화</div><div>수</div><div>목</div><div>금</div><div class="text-blue-500">토</div>
            </div>
            <div class="grid grid-cols-7 gap-1">${cells}</div>
        </div>
    </div>`;
}

// End of file
