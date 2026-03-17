// 2026 길운 달력 - 메인 애플리케이션
// 2026년 단일 연도 전용

// 전역 변수
let currentCustomer = null;
const FIXED_YEAR = 2026;

// DOM 로드 완료 시
document.addEventListener('DOMContentLoaded', function () {
    checkToken();
});

// 토큰 체크
function checkToken() {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    const savedToken = localStorage.getItem('gilun_token');

    const token = tokenFromUrl || savedToken;

    if (token) {
        loadCustomerByToken(token);
    } else {
        showTokenScreen();
    }
}

// 토큰 화면 표시
function showTokenScreen() {
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('tokenScreen').classList.remove('hidden');
    document.getElementById('mainContent').classList.add('hidden');
}

// 토큰 검증
async function verifyToken() {
    const token = document.getElementById('tokenInput').value.trim();
    if (!token) {
        showTokenError('생년월일을 입력해주세요.');
        return;
    }
    await loadCustomerByToken(token);
}

// 토큰으로 고객 정보 로드
async function loadCustomerByToken(token) {
    try {
        document.getElementById('loading').classList.remove('hidden');
        document.getElementById('tokenScreen').classList.add('hidden');

        const response = await fetch(`tables/customers?search=${encodeURIComponent(token)}`);
        const result = await response.json();

        if (result.data && result.data.length > 0) {
            const customer = result.data.find(c => c.token === token);
            if (customer) {
                currentCustomer = customer;
                localStorage.setItem('gilun_token', token);
                const newUrl = `${window.location.pathname}?token=${token}`;
                window.history.replaceState({}, '', newUrl);
                renderCalendar();
                return;
            }
        }

        showTokenScreen();
        showTokenError('등록되지 않은 생년월일입니다.');
    } catch (error) {
        console.error('Error loading customer:', error);
        showTokenScreen();
        showTokenError('서버 연결 오류가 발생했습니다.');
    }
}

// 토큰 에러 표시
function showTokenError(message) {
    const errorEl = document.getElementById('tokenError');
    errorEl.textContent = message;
    errorEl.classList.remove('hidden');
    document.getElementById('loading').classList.add('hidden');
}

// 로그아웃
function logout() {
    localStorage.removeItem('gilun_token');
    window.location.href = 'index.html';
}

// ========== 메인 렌더링 ==========

function renderCalendar() {
    const sajuData = JSON.parse(currentCustomer.saju_data);
    const pillars = SajuCalendar.correctPillars(sajuData, currentCustomer.birth_info);

    document.getElementById('welcomeName').textContent = currentCustomer.name;
    document.getElementById('calendarYear').textContent = FIXED_YEAR;
    document.getElementById('metaDescription').content =
        `${currentCustomer.name}님의 ${FIXED_YEAR}년 개인 맞춤 운세 캘린더`;

    document.getElementById('loading').classList.add('hidden');
    document.getElementById('tokenScreen').classList.add('hidden');
    document.getElementById('mainContent').classList.remove('hidden');

    document.getElementById('userGreeting').textContent =
        `${currentCustomer.name}님의 ${FIXED_YEAR}년 개인 맞춤 운세 캘린더`;

    const daeunData = SajuCalendar.getDaeun(sajuData);
    const sewunData = SajuCalendar.getSewun(sajuData);

    renderUserInfo(sajuData);
    renderPillars(pillars);
    renderCurrentDaeun(daeunData, FIXED_YEAR);
    renderSewunSummary(sewunData.data, FIXED_YEAR);
    renderMonthlyCalendars(sajuData, FIXED_YEAR);
}

// 사용자 정보 렌더링
function renderUserInfo(sajuData) {
    const userInfo = sajuData.user_info;
    const ilgan = SajuCalendar.getIlgan(sajuData);

    const html = `
        <h3 class="text-lg font-bold text-gray-700 mb-4 flex items-center">
            <i class="fas fa-user text-purple-500 mr-2"></i>기본 정보
        </h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 overflow-hidden">
                <span class="text-gray-500 text-sm">생년월일시</span>
                <p class="font-bold text-gray-800 text-sm mt-1">${currentCustomer.birth_info || '-'}</p>
            </div>
            <div class="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4">
                <span class="text-gray-500 text-sm">일간(본인)</span>
                <p class="font-bold text-gray-800 text-lg mt-1">${ilgan}</p>
            </div>
            <div class="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4">
                <span class="text-gray-500 text-sm">성별</span>
                <p class="font-bold text-gray-800 text-lg mt-1">${currentCustomer.gender || '-'}</p>
            </div>
            <div class="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4">
                <span class="text-gray-500 text-sm">대운방향</span>
                <p class="font-bold text-gray-800 text-lg mt-1">${SajuCalendar.getDaeun(sajuData).direction || '-'}</p>
            </div>
        </div>
    `;
    document.getElementById('userInfoBox').innerHTML = html;
}

// 사주 기둥 렌더링
function renderPillars(pillars) {
    if (!pillars || pillars.length === 0) return;

    let html = '';
    pillars.forEach((p) => {
        const ganji = p.ganji || '??';
        html += `
            <div class="pillar-box text-center text-white min-w-[75px]">
                <div class="text-xs text-purple-300 mb-2 font-medium">${p.title}</div>
                <div class="hanja-large">${ganji[0] || '?'}</div>
                <div class="text-xs text-purple-300 my-1">${p.cheon_sip || p.sipseong || '-'}</div>
                <div class="hanja-large">${ganji[1] || '?'}</div>
                <div class="text-xs text-purple-300 mt-1">${p.ji_sip || ''}</div>
                ${p.sinsal && p.sinsal !== '-' ? `<div class="text-[10px] text-yellow-300 mt-2">${p.sinsal}</div>` : ''}
            </div>
        `;
    });
    document.getElementById('pillarBox').innerHTML = html;
}

// 현재 대운 렌더링
function renderCurrentDaeun(daeun, year) {
    const currentDaeun = daeun.data.find(d => d.연도 <= year && d.연도 + 10 > year);
    if (!currentDaeun) return;

    const progress = ((year - currentDaeun.연도) / 10) * 100;

    const html = `
        <div class="bg-gradient-to-r from-purple-100 via-indigo-100 to-purple-100 rounded-2xl p-5 border border-purple-200">
            <div class="flex items-center justify-between mb-4">
                <span class="text-lg font-bold text-purple-800 flex items-center">
                    <i class="fas fa-star text-yellow-500 mr-2"></i>현재 대운 (${currentDaeun.연도}~${currentDaeun.연도 + 9})
                </span>
                <span class="text-3xl font-serif font-black text-purple-900">${currentDaeun.간지}</span>
            </div>
            <div class="flex items-center gap-6 text-base text-purple-700 mb-3">
                <span><strong>십성:</strong> ${currentDaeun.십성}</span>
                <span><strong>신살:</strong> ${currentDaeun.신살 || '-'}</span>
            </div>
            <div class="bg-purple-200 rounded-full h-3 overflow-hidden">
                <div class="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full h-3" style="width: ${progress}%"></div>
            </div>
            <p class="text-sm text-purple-600 mt-2 text-right">${Math.round(progress)}% 진행</p>
        </div>
    `;
    document.getElementById('currentDaeunBox').innerHTML = html;
}

// 세운 요약 렌더링
function renderSewunSummary(sewunData, year) {
    const sewun = sewunData.find(s => s.연도 === year);
    if (!sewun) return;

    const html = `
        <div class="flex flex-col md:flex-row md:items-center gap-6">
            <div class="flex items-center gap-5">
                <div class="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span class="text-3xl font-serif font-black text-white">${sewun.세운간지}</span>
                </div>
                <div>
                    <h3 class="text-2xl font-bold text-gray-800">${year}년 세운</h3>
                    <p class="text-lg text-gray-600 mt-1">십성: <strong>${sewun.세운십성}</strong></p>
                </div>
            </div>
            <div class="flex-grow grid grid-cols-2 md:grid-cols-3 gap-3">
                <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4">
                    <span class="text-gray-500 text-sm">세운 간지</span>
                    <p class="font-bold text-xl mt-1">${sewun.세운간지}</p>
                </div>
                <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4">
                    <span class="text-gray-500 text-sm">세운 십성</span>
                    <p class="font-bold text-xl mt-1">${sewun.세운십성}</p>
                </div>
                <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4">
                    <span class="text-gray-500 text-sm">세운 신살</span>
                    <p class="font-bold text-xl mt-1">${sewun.세운신살 || '-'}</p>
                </div>
            </div>
        </div>
    `;
    document.getElementById('sewunSummary').innerHTML = html;
}

// ========== 월별 달력 렌더링 ==========

// ========== 월별 달력 렌더링 ==========

function renderMonthlyCalendars(sajuData, year) {
    const sewunData = SajuCalendar.getSewun(sajuData);
    const sewun = (sewunData.data || []).find(s => s.연도 === year);
    if (!sewun) return;

    const ilgan = SajuCalendar.getIlgan(sajuData);

    let html = '<div class="space-y-10">';

    // 양력 1월 ~ 12월 루프
    for (let m = 1; m <= 12; m++) {
        let monthData;

        // 2026년 1월 예외 처리 (기축월) - admin.js와 동일한 로직
        if (m === 1 && FIXED_YEAR === 2026) {
            monthData = {
                월: '1월',
                간지: '己丑',
                십성: '비견/비견',
                신살: '-',
                luck: 'normal',
                keyword: '경쟁/협력',
                advice: '동료와의 협력이 중요'
            };
        } else {
            // 그 외: 양력 m월 -> 사주 (m-1)월 데이터 매핑
            const sajuMonthNum = m - 1;
            monthData = sewun.월운.find(x => x.월 === `${sajuMonthNum}월`);
        }

        if (monthData) {
            const calendarData = SajuCalendar.generateCalendarData(year, m, ilgan, monthData);

            const greatCount = calendarData.days.filter(d => d.luck === 'great').length;
            const cautionCount = calendarData.days.filter(d => d.luck === 'caution').length;
            let monthTheme = 'month-theme-normal';
            if (greatCount >= 8) monthTheme = 'month-theme-good';
            else if (cautionCount >= 8) monthTheme = 'month-theme-caution';

            const issuesSummary = generateIssuesSummary(calendarData.summary.issuesByType);

            html += `
                <div class="info-card ${monthTheme} month-calendar" data-month="${m}">
                    <div class="p-6 bg-gradient-to-r from-gray-50 to-white border-b">
                        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div class="flex items-center gap-4">
                                <span class="text-4xl font-black text-gray-800">${m}월</span>
                                <span class="text-3xl font-serif font-bold text-purple-700">${monthData.간지}</span>
                                <span class="text-lg text-gray-600 font-medium">${monthData.십성}</span>
                                ${monthData.신살 && monthData.신살 !== '-' ? `<span class="text-base bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">${monthData.신살}</span>` : ''}
                            </div>
                            <div class="text-lg">
                                <span class="text-amber-600 font-bold">★길일 ${calendarData.summary.goodDays.length > 0 ? calendarData.summary.goodDays.join(', ') + '일' : '-'}</span>
                                ${calendarData.summary.cautionDays.length > 0 ? `<span class="ml-4 text-red-500 font-bold">△주의 ${calendarData.summary.cautionDays.join(', ')}일</span>` : ''}
                            </div>
                        </div>
                        <div class="mt-4 p-4 bg-white rounded-xl border text-base">
                            <div class="flex flex-wrap gap-6 mb-3">
                                <span><strong class="text-purple-700">📌 키워드:</strong> ${calendarData.summary.keyword}</span>
                                <span><strong class="text-gray-600">💡 조언:</strong> ${calendarData.summary.advice}</span>
                                ${calendarData.summary.sinsalNote ? `<span><strong class="text-orange-600">✨ 특징:</strong> ${calendarData.summary.sinsalNote}</span>` : ''}
                            </div>
                            ${issuesSummary ? `<div class="pt-3 border-t border-gray-100">${issuesSummary}</div>` : ''}
                        </div>
                    </div>
                    
                    <div class="p-4 md:p-6">
                        <div class="grid grid-cols-7 text-center text-lg font-bold mb-2">
                            <div class="py-3 text-red-500">일</div>
                            <div class="py-3 text-gray-700">월</div>
                            <div class="py-3 text-gray-700">화</div>
                            <div class="py-3 text-gray-700">수</div>
                            <div class="py-3 text-gray-700">목</div>
                            <div class="py-3 text-gray-700">금</div>
                            <div class="py-3 text-blue-500">토</div>
                        </div>
                        <div class="grid grid-cols-7 gap-1">
                            ${renderCalendarDays(calendarData)}
                        </div>
                    </div>
                </div>
            `;
        }
    }

    html += '</div>';
    document.getElementById('calendarSection').innerHTML = html;
}

// 이슈별 요약 생성
function generateIssuesSummary(issuesByType) {
    if (!issuesByType || Object.keys(issuesByType).length === 0) return '';

    let html = '<div class="flex flex-wrap gap-4 text-sm">';
    const priorityOrder = ['wealth', 'business', 'travel', 'noble', 'document', 'charm', 'study', 'cooperation'];

    priorityOrder.forEach(type => {
        if (issuesByType[type] && issuesByType[type].days.length > 0) {
            const info = issuesByType[type];
            const days = info.days.slice(0, 5).join(', ');
            const more = info.days.length > 5 ? ` 외 ${info.days.length - 5}일` : '일';
            html += `
                <span class="inline-flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
                    <span class="text-lg">${info.icon}</span>
                    <strong>${info.label}:</strong>
                    <span class="text-gray-600">${days}${more}</span>
                </span>
            `;
        }
    });

    html += '</div>';
    return html;
}

// 달력 날짜 셀 렌더링
function renderCalendarDays(calendarData) {
    let html = '';

    for (let i = 0; i < calendarData.firstDay; i++) {
        html += '<div class="calendar-cell empty"></div>';
    }

    calendarData.days.forEach((dayData, index) => {
        const dayOfWeek = (calendarData.firstDay + index) % 7;
        const isSunday = dayOfWeek === 0;
        const isSaturday = dayOfWeek === 6;

        let cellClass = `calendar-cell ${dayData.colorClass}`;
        if (isSunday) cellClass += ' sunday';
        if (isSaturday) cellClass += ' saturday';

        const issueIcons = dayData.issues.slice(0, 2).map(issue =>
            `<span class="issue-tag bg-white/80 ${issue.color}" title="${issue.label}">${issue.icon}</span>`
        ).join('');

        const issueLabels = dayData.issues.map(i => i.label).join(', ');
        const tooltipText = [...dayData.reasons, ...(issueLabels ? [issueLabels] : [])].join(' / ');

        html += `
            <div class="${cellClass}" title="${tooltipText || dayData.ganji}">
                <div class="day-number">${dayData.day}</div>
                <div class="ganji">${dayData.ganji}</div>
                <div class="text-[10px] text-gray-500 font-medium leading-tight mt-1">
                    ${dayData.lunar ?
                `음력 ${dayData.lunar.isLeap ? '<span class="text-red-500 font-bold">윤</span> ' : ''}${dayData.lunar.month}월 ${dayData.lunar.day}일`
                : ''}
                </div>
                <div class="luck-symbol">${dayData.symbol}</div>
                ${dayData.issues.length > 0 ? `<div class="issues-container">${issueIcons}</div>` : ''}
            </div>
        `;
    });

    return html;
}

// ========== PDF 다운로드 (각 페이지 개별 생성 후 합치기) ==========

async function downloadPDF() {
    const customerName = currentCustomer.name;

    // 버튼 상태 변경
    const btn = event.target.closest('button');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>PDF 생성 중... (0/13)';
    btn.disabled = true;

    try {
        const { jsPDF } = window.jspdf || {};

        // jsPDF 직접 사용
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        // 커버 섹션
        const coverSection = document.getElementById('coverSection');
        const sewunSection = document.getElementById('sewunSummary');

        // 커버 페이지 생성
        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>PDF 생성 중... (1/13)';

        const coverDiv = document.createElement('div');
        coverDiv.style.cssText = 'width:1050px;padding:40px;background:white;position:absolute;left:-9999px;display:flex;flex-direction:column;gap:30px;';
        coverDiv.innerHTML = `
            <div style="width:100%;">${coverSection.innerHTML}</div>
            <div style="width:100%;">${sewunSection.outerHTML}</div>
        `;
        document.body.appendChild(coverDiv);

        const coverCanvas = await html2canvas(coverDiv, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
        });

        const coverImg = coverCanvas.toDataURL('image/jpeg', 0.92);
        const coverRatio = coverCanvas.height / coverCanvas.width;
        const imgWidth = pageWidth - 16;
        const imgHeight = imgWidth * coverRatio;

        pdf.addImage(coverImg, 'JPEG', 8, 8, imgWidth, Math.min(imgHeight, pageHeight - 16));
        document.body.removeChild(coverDiv);

        // 월별 달력 페이지 생성
        const monthCalendars = document.querySelectorAll('.month-calendar');

        for (let i = 0; i < monthCalendars.length; i++) {
            btn.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i>PDF 생성 중... (${i + 2}/13)`;

            pdf.addPage();

            const monthDiv = document.createElement('div');
            monthDiv.style.cssText = 'width:1050px;padding:15px;background:white;position:absolute;left:-9999px;';
            monthDiv.innerHTML = monthCalendars[i].outerHTML;
            document.body.appendChild(monthDiv);

            const monthCanvas = await html2canvas(monthDiv, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });

            const monthImg = monthCanvas.toDataURL('image/jpeg', 0.92);
            const monthRatio = monthCanvas.height / monthCanvas.width;
            const mImgWidth = pageWidth - 16;
            const mImgHeight = mImgWidth * monthRatio;

            pdf.addImage(monthImg, 'JPEG', 8, 8, mImgWidth, Math.min(mImgHeight, pageHeight - 16));
            document.body.removeChild(monthDiv);
        }

        // PDF 저장
        pdf.save(`${customerName}_${FIXED_YEAR}년_길운달력.pdf`);

    } catch (error) {
        console.error('PDF 생성 오류:', error);
        alert('PDF 생성 중 오류가 발생했습니다: ' + error.message);
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}
