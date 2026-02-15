// 2026 길운 달력 - 사주 달력 핵심 로직

// ========== 60갑자 기초 데이터 ==========
const CHEONGAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const JIJI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 60갑자 배열
const GANJI_60 = [];
for (let i = 0; i < 60; i++) {
    GANJI_60.push(CHEONGAN[i % 10] + JIJI[i % 12]);
}

// 천간 오행
const CHEONGAN_OHENG = {
    '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土',
    '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水'
};

// 지지 오행
const JIJI_OHENG = {
    '子': '水', '丑': '土', '寅': '木', '卯': '木', '辰': '土', '巳': '火',
    '午': '火', '未': '土', '申': '金', '酉': '金', '戌': '土', '亥': '水'
};

// 지지 한글 이름
const JIJI_NAME = {
    '子': '자', '丑': '축', '寅': '인', '卯': '묘', '辰': '진', '巳': '사',
    '午': '오', '未': '미', '申': '신', '酉': '유', '戌': '술', '亥': '해'
};

const LUNAR_DATA_2026 = { "1-1": { "month": 11, "day": 13, "isLeap": false }, "1-2": { "month": 11, "day": 14, "isLeap": false }, "1-3": { "month": 11, "day": 15, "isLeap": false }, "1-4": { "month": 11, "day": 16, "isLeap": false }, "1-5": { "month": 11, "day": 17, "isLeap": false }, "1-6": { "month": 11, "day": 18, "isLeap": false }, "1-7": { "month": 11, "day": 19, "isLeap": false }, "1-8": { "month": 11, "day": 20, "isLeap": false }, "1-9": { "month": 11, "day": 21, "isLeap": false }, "1-10": { "month": 11, "day": 22, "isLeap": false }, "1-11": { "month": 11, "day": 23, "isLeap": false }, "1-12": { "month": 11, "day": 24, "isLeap": false }, "1-13": { "month": 11, "day": 25, "isLeap": false }, "1-14": { "month": 11, "day": 26, "isLeap": false }, "1-15": { "month": 11, "day": 27, "isLeap": false }, "1-16": { "month": 11, "day": 28, "isLeap": false }, "1-17": { "month": 11, "day": 29, "isLeap": false }, "1-18": { "month": 11, "day": 30, "isLeap": false }, "1-19": { "month": 12, "day": 1, "isLeap": false }, "1-20": { "month": 12, "day": 2, "isLeap": false }, "1-21": { "month": 12, "day": 3, "isLeap": false }, "1-22": { "month": 12, "day": 4, "isLeap": false }, "1-23": { "month": 12, "day": 5, "isLeap": false }, "1-24": { "month": 12, "day": 6, "isLeap": false }, "1-25": { "month": 12, "day": 7, "isLeap": false }, "1-26": { "month": 12, "day": 8, "isLeap": false }, "1-27": { "month": 12, "day": 9, "isLeap": false }, "1-28": { "month": 12, "day": 10, "isLeap": false }, "1-29": { "month": 12, "day": 11, "isLeap": false }, "1-30": { "month": 12, "day": 12, "isLeap": false }, "1-31": { "month": 12, "day": 13, "isLeap": false }, "2-1": { "month": 12, "day": 14, "isLeap": false }, "2-2": { "month": 12, "day": 15, "isLeap": false }, "2-3": { "month": 12, "day": 16, "isLeap": false }, "2-4": { "month": 12, "day": 17, "isLeap": false }, "2-5": { "month": 12, "day": 18, "isLeap": false }, "2-6": { "month": 12, "day": 19, "isLeap": false }, "2-7": { "month": 12, "day": 20, "isLeap": false }, "2-8": { "month": 12, "day": 21, "isLeap": false }, "2-9": { "month": 12, "day": 22, "isLeap": false }, "2-10": { "month": 12, "day": 23, "isLeap": false }, "2-11": { "month": 12, "day": 24, "isLeap": false }, "2-12": { "month": 12, "day": 25, "isLeap": false }, "2-13": { "month": 12, "day": 26, "isLeap": false }, "2-14": { "month": 12, "day": 27, "isLeap": false }, "2-15": { "month": 12, "day": 28, "isLeap": false }, "2-16": { "month": 12, "day": 29, "isLeap": false }, "2-17": { "month": 1, "day": 1, "isLeap": false }, "2-18": { "month": 1, "day": 2, "isLeap": false }, "2-19": { "month": 1, "day": 3, "isLeap": false }, "2-20": { "month": 1, "day": 4, "isLeap": false }, "2-21": { "month": 1, "day": 5, "isLeap": false }, "2-22": { "month": 1, "day": 6, "isLeap": false }, "2-23": { "month": 1, "day": 7, "isLeap": false }, "2-24": { "month": 1, "day": 8, "isLeap": false }, "2-25": { "month": 1, "day": 9, "isLeap": false }, "2-26": { "month": 1, "day": 10, "isLeap": false }, "2-27": { "month": 1, "day": 11, "isLeap": false }, "2-28": { "month": 1, "day": 12, "isLeap": false }, "3-1": { "month": 1, "day": 13, "isLeap": false }, "3-2": { "month": 1, "day": 14, "isLeap": false }, "3-3": { "month": 1, "day": 15, "isLeap": false }, "3-4": { "month": 1, "day": 16, "isLeap": false }, "3-5": { "month": 1, "day": 17, "isLeap": false }, "3-6": { "month": 1, "day": 18, "isLeap": false }, "3-7": { "month": 1, "day": 19, "isLeap": false }, "3-8": { "month": 1, "day": 20, "isLeap": false }, "3-9": { "month": 1, "day": 21, "isLeap": false }, "3-10": { "month": 1, "day": 22, "isLeap": false }, "3-11": { "month": 1, "day": 23, "isLeap": false }, "3-12": { "month": 1, "day": 24, "isLeap": false }, "3-13": { "month": 1, "day": 25, "isLeap": false }, "3-14": { "month": 1, "day": 26, "isLeap": false }, "3-15": { "month": 1, "day": 27, "isLeap": false }, "3-16": { "month": 1, "day": 28, "isLeap": false }, "3-17": { "month": 1, "day": 29, "isLeap": false }, "3-18": { "month": 1, "day": 30, "isLeap": false }, "3-19": { "month": 2, "day": 1, "isLeap": false }, "3-20": { "month": 2, "day": 2, "isLeap": false }, "3-21": { "month": 2, "day": 3, "isLeap": false }, "3-22": { "month": 2, "day": 4, "isLeap": false }, "3-23": { "month": 2, "day": 5, "isLeap": false }, "3-24": { "month": 2, "day": 6, "isLeap": false }, "3-25": { "month": 2, "day": 7, "isLeap": false }, "3-26": { "month": 2, "day": 8, "isLeap": false }, "3-27": { "month": 2, "day": 9, "isLeap": false }, "3-28": { "month": 2, "day": 10, "isLeap": false }, "3-29": { "month": 2, "day": 11, "isLeap": false }, "3-30": { "month": 2, "day": 12, "isLeap": false }, "3-31": { "month": 2, "day": 13, "isLeap": false }, "4-1": { "month": 2, "day": 14, "isLeap": false }, "4-2": { "month": 2, "day": 15, "isLeap": false }, "4-3": { "month": 2, "day": 16, "isLeap": false }, "4-4": { "month": 2, "day": 17, "isLeap": false }, "4-5": { "month": 2, "day": 18, "isLeap": false }, "4-6": { "month": 2, "day": 19, "isLeap": false }, "4-7": { "month": 2, "day": 20, "isLeap": false }, "4-8": { "month": 2, "day": 21, "isLeap": false }, "4-9": { "month": 2, "day": 22, "isLeap": false }, "4-10": { "month": 2, "day": 23, "isLeap": false }, "4-11": { "month": 2, "day": 24, "isLeap": false }, "4-12": { "month": 2, "day": 25, "isLeap": false }, "4-13": { "month": 2, "day": 26, "isLeap": false }, "4-14": { "month": 2, "day": 27, "isLeap": false }, "4-15": { "month": 2, "day": 28, "isLeap": false }, "4-16": { "month": 2, "day": 29, "isLeap": false }, "4-17": { "month": 3, "day": 1, "isLeap": false }, "4-18": { "month": 3, "day": 2, "isLeap": false }, "4-19": { "month": 3, "day": 3, "isLeap": false }, "4-20": { "month": 3, "day": 4, "isLeap": false }, "4-21": { "month": 3, "day": 5, "isLeap": false }, "4-22": { "month": 3, "day": 6, "isLeap": false }, "4-23": { "month": 3, "day": 7, "isLeap": false }, "4-24": { "month": 3, "day": 8, "isLeap": false }, "4-25": { "month": 3, "day": 9, "isLeap": false }, "4-26": { "month": 3, "day": 10, "isLeap": false }, "4-27": { "month": 3, "day": 11, "isLeap": false }, "4-28": { "month": 3, "day": 12, "isLeap": false }, "4-29": { "month": 3, "day": 13, "isLeap": false }, "4-30": { "month": 3, "day": 14, "isLeap": false }, "5-1": { "month": 3, "day": 15, "isLeap": false }, "5-2": { "month": 3, "day": 16, "isLeap": false }, "5-3": { "month": 3, "day": 17, "isLeap": false }, "5-4": { "month": 3, "day": 18, "isLeap": false }, "5-5": { "month": 3, "day": 19, "isLeap": false }, "5-6": { "month": 3, "day": 20, "isLeap": false }, "5-7": { "month": 3, "day": 21, "isLeap": false }, "5-8": { "month": 3, "day": 22, "isLeap": false }, "5-9": { "month": 3, "day": 23, "isLeap": false }, "5-10": { "month": 3, "day": 24, "isLeap": false }, "5-11": { "month": 3, "day": 25, "isLeap": false }, "5-12": { "month": 3, "day": 26, "isLeap": false }, "5-13": { "month": 3, "day": 27, "isLeap": false }, "5-14": { "month": 3, "day": 28, "isLeap": false }, "5-15": { "month": 3, "day": 29, "isLeap": false }, "5-16": { "month": 3, "day": 30, "isLeap": false }, "5-17": { "month": 4, "day": 1, "isLeap": false }, "5-18": { "month": 4, "day": 2, "isLeap": false }, "5-19": { "month": 4, "day": 3, "isLeap": false }, "5-20": { "month": 4, "day": 4, "isLeap": false }, "5-21": { "month": 4, "day": 5, "isLeap": false }, "5-22": { "month": 4, "day": 6, "isLeap": false }, "5-23": { "month": 4, "day": 7, "isLeap": false }, "5-24": { "month": 4, "day": 8, "isLeap": false }, "5-25": { "month": 4, "day": 9, "isLeap": false }, "5-26": { "month": 4, "day": 10, "isLeap": false }, "5-27": { "month": 4, "day": 11, "isLeap": false }, "5-28": { "month": 4, "day": 12, "isLeap": false }, "5-29": { "month": 4, "day": 13, "isLeap": false }, "5-30": { "month": 4, "day": 14, "isLeap": false }, "5-31": { "month": 4, "day": 15, "isLeap": false }, "6-1": { "month": 4, "day": 16, "isLeap": false }, "6-2": { "month": 4, "day": 17, "isLeap": false }, "6-3": { "month": 4, "day": 18, "isLeap": false }, "6-4": { "month": 4, "day": 19, "isLeap": false }, "6-5": { "month": 4, "day": 20, "isLeap": false }, "6-6": { "month": 4, "day": 21, "isLeap": false }, "6-7": { "month": 4, "day": 22, "isLeap": false }, "6-8": { "month": 4, "day": 23, "isLeap": false }, "6-9": { "month": 4, "day": 24, "isLeap": false }, "6-10": { "month": 4, "day": 25, "isLeap": false }, "6-11": { "month": 4, "day": 26, "isLeap": false }, "6-12": { "month": 4, "day": 27, "isLeap": false }, "6-13": { "month": 4, "day": 28, "isLeap": false }, "6-14": { "month": 4, "day": 29, "isLeap": false }, "6-15": { "month": 5, "day": 1, "isLeap": false }, "6-16": { "month": 5, "day": 2, "isLeap": false }, "6-17": { "month": 5, "day": 3, "isLeap": false }, "6-18": { "month": 5, "day": 4, "isLeap": false }, "6-19": { "month": 5, "day": 5, "isLeap": false }, "6-20": { "month": 5, "day": 6, "isLeap": false }, "6-21": { "month": 5, "day": 7, "isLeap": false }, "6-22": { "month": 5, "day": 8, "isLeap": false }, "6-23": { "month": 5, "day": 9, "isLeap": false }, "6-24": { "month": 5, "day": 10, "isLeap": false }, "6-25": { "month": 5, "day": 11, "isLeap": false }, "6-26": { "month": 5, "day": 12, "isLeap": false }, "6-27": { "month": 5, "day": 13, "isLeap": false }, "6-28": { "month": 5, "day": 14, "isLeap": false }, "6-29": { "month": 5, "day": 15, "isLeap": false }, "6-30": { "month": 5, "day": 16, "isLeap": false }, "7-1": { "month": 5, "day": 17, "isLeap": false }, "7-2": { "month": 5, "day": 18, "isLeap": false }, "7-3": { "month": 5, "day": 19, "isLeap": false }, "7-4": { "month": 5, "day": 20, "isLeap": false }, "7-5": { "month": 5, "day": 21, "isLeap": false }, "7-6": { "month": 5, "day": 22, "isLeap": false }, "7-7": { "month": 5, "day": 23, "isLeap": false }, "7-8": { "month": 5, "day": 24, "isLeap": false }, "7-9": { "month": 5, "day": 25, "isLeap": false }, "7-10": { "month": 5, "day": 26, "isLeap": false }, "7-11": { "month": 5, "day": 27, "isLeap": false }, "7-12": { "month": 5, "day": 28, "isLeap": false }, "7-13": { "month": 5, "day": 29, "isLeap": false }, "7-14": { "month": 6, "day": 1, "isLeap": false }, "7-15": { "month": 6, "day": 2, "isLeap": false }, "7-16": { "month": 6, "day": 3, "isLeap": false }, "7-17": { "month": 6, "day": 4, "isLeap": false }, "7-18": { "month": 6, "day": 5, "isLeap": false }, "7-19": { "month": 6, "day": 6, "isLeap": false }, "7-20": { "month": 6, "day": 7, "isLeap": false }, "7-21": { "month": 6, "day": 8, "isLeap": false }, "7-22": { "month": 6, "day": 9, "isLeap": false }, "7-23": { "month": 6, "day": 10, "isLeap": false }, "7-24": { "month": 6, "day": 11, "isLeap": false }, "7-25": { "month": 6, "day": 12, "isLeap": false }, "7-26": { "month": 6, "day": 13, "isLeap": false }, "7-27": { "month": 6, "day": 14, "isLeap": false }, "7-28": { "month": 6, "day": 15, "isLeap": false }, "7-29": { "month": 6, "day": 16, "isLeap": false }, "7-30": { "month": 6, "day": 17, "isLeap": false }, "7-31": { "month": 6, "day": 18, "isLeap": false }, "8-1": { "month": 6, "day": 19, "isLeap": false }, "8-2": { "month": 6, "day": 20, "isLeap": false }, "8-3": { "month": 6, "day": 21, "isLeap": false }, "8-4": { "month": 6, "day": 22, "isLeap": false }, "8-5": { "month": 6, "day": 23, "isLeap": false }, "8-6": { "month": 6, "day": 24, "isLeap": false }, "8-7": { "month": 6, "day": 25, "isLeap": false }, "8-8": { "month": 6, "day": 26, "isLeap": false }, "8-9": { "month": 6, "day": 27, "isLeap": false }, "8-10": { "month": 6, "day": 28, "isLeap": false }, "8-11": { "month": 6, "day": 29, "isLeap": false }, "8-12": { "month": 6, "day": 30, "isLeap": false }, "8-13": { "month": 7, "day": 1, "isLeap": false }, "8-14": { "month": 7, "day": 2, "isLeap": false }, "8-15": { "month": 7, "day": 3, "isLeap": false }, "8-16": { "month": 7, "day": 4, "isLeap": false }, "8-17": { "month": 7, "day": 5, "isLeap": false }, "8-18": { "month": 7, "day": 6, "isLeap": false }, "8-19": { "month": 7, "day": 7, "isLeap": false }, "8-20": { "month": 7, "day": 8, "isLeap": false }, "8-21": { "month": 7, "day": 9, "isLeap": false }, "8-22": { "month": 7, "day": 10, "isLeap": false }, "8-23": { "month": 7, "day": 11, "isLeap": false }, "8-24": { "month": 7, "day": 12, "isLeap": false }, "8-25": { "month": 7, "day": 13, "isLeap": false }, "8-26": { "month": 7, "day": 14, "isLeap": false }, "8-27": { "month": 7, "day": 15, "isLeap": false }, "8-28": { "month": 7, "day": 16, "isLeap": false }, "8-29": { "month": 7, "day": 17, "isLeap": false }, "8-30": { "month": 7, "day": 18, "isLeap": false }, "8-31": { "month": 7, "day": 19, "isLeap": false }, "9-1": { "month": 7, "day": 20, "isLeap": false }, "9-2": { "month": 7, "day": 21, "isLeap": false }, "9-3": { "month": 7, "day": 22, "isLeap": false }, "9-4": { "month": 7, "day": 23, "isLeap": false }, "9-5": { "month": 7, "day": 24, "isLeap": false }, "9-6": { "month": 7, "day": 25, "isLeap": false }, "9-7": { "month": 7, "day": 26, "isLeap": false }, "9-8": { "month": 7, "day": 27, "isLeap": false }, "9-9": { "month": 7, "day": 28, "isLeap": false }, "9-10": { "month": 7, "day": 29, "isLeap": false }, "9-11": { "month": 8, "day": 1, "isLeap": false }, "9-12": { "month": 8, "day": 2, "isLeap": false }, "9-13": { "month": 8, "day": 3, "isLeap": false }, "9-14": { "month": 8, "day": 4, "isLeap": false }, "9-15": { "month": 8, "day": 5, "isLeap": false }, "9-16": { "month": 8, "day": 6, "isLeap": false }, "9-17": { "month": 8, "day": 7, "isLeap": false }, "9-18": { "month": 8, "day": 8, "isLeap": false }, "9-19": { "month": 8, "day": 9, "isLeap": false }, "9-20": { "month": 8, "day": 10, "isLeap": false }, "9-21": { "month": 8, "day": 11, "isLeap": false }, "9-22": { "month": 8, "day": 12, "isLeap": false }, "9-23": { "month": 8, "day": 13, "isLeap": false }, "9-24": { "month": 8, "day": 14, "isLeap": false }, "9-25": { "month": 8, "day": 15, "isLeap": false }, "9-26": { "month": 8, "day": 16, "isLeap": false }, "9-27": { "month": 8, "day": 17, "isLeap": false }, "9-28": { "month": 8, "day": 18, "isLeap": false }, "9-29": { "month": 8, "day": 19, "isLeap": false }, "9-30": { "month": 8, "day": 20, "isLeap": false }, "10-1": { "month": 8, "day": 21, "isLeap": false }, "10-2": { "month": 8, "day": 22, "isLeap": false }, "10-3": { "month": 8, "day": 23, "isLeap": false }, "10-4": { "month": 8, "day": 24, "isLeap": false }, "10-5": { "month": 8, "day": 25, "isLeap": false }, "10-6": { "month": 8, "day": 26, "isLeap": false }, "10-7": { "month": 8, "day": 27, "isLeap": false }, "10-8": { "month": 8, "day": 28, "isLeap": false }, "10-9": { "month": 8, "day": 29, "isLeap": false }, "10-10": { "month": 8, "day": 30, "isLeap": false }, "10-11": { "month": 9, "day": 1, "isLeap": false }, "10-12": { "month": 9, "day": 2, "isLeap": false }, "10-13": { "month": 9, "day": 3, "isLeap": false }, "10-14": { "month": 9, "day": 4, "isLeap": false }, "10-15": { "month": 9, "day": 5, "isLeap": false }, "10-16": { "month": 9, "day": 6, "isLeap": false }, "10-17": { "month": 9, "day": 7, "isLeap": false }, "10-18": { "month": 9, "day": 8, "isLeap": false }, "10-19": { "month": 9, "day": 9, "isLeap": false }, "10-20": { "month": 9, "day": 10, "isLeap": false }, "10-21": { "month": 9, "day": 11, "isLeap": false }, "10-22": { "month": 9, "day": 12, "isLeap": false }, "10-23": { "month": 9, "day": 13, "isLeap": false }, "10-24": { "month": 9, "day": 14, "isLeap": false }, "10-25": { "month": 9, "day": 15, "isLeap": false }, "10-26": { "month": 9, "day": 16, "isLeap": false }, "10-27": { "month": 9, "day": 17, "isLeap": false }, "10-28": { "month": 9, "day": 18, "isLeap": false }, "10-29": { "month": 9, "day": 19, "isLeap": false }, "10-30": { "month": 9, "day": 20, "isLeap": false }, "10-31": { "month": 9, "day": 21, "isLeap": false }, "11-1": { "month": 9, "day": 22, "isLeap": false }, "11-2": { "month": 9, "day": 23, "isLeap": false }, "11-3": { "month": 9, "day": 24, "isLeap": false }, "11-4": { "month": 9, "day": 25, "isLeap": false }, "11-5": { "month": 9, "day": 26, "isLeap": false }, "11-6": { "month": 9, "day": 27, "isLeap": false }, "11-7": { "month": 9, "day": 28, "isLeap": false }, "11-8": { "month": 9, "day": 29, "isLeap": false }, "11-9": { "month": 10, "day": 1, "isLeap": false }, "11-10": { "month": 10, "day": 2, "isLeap": false }, "11-11": { "month": 10, "day": 3, "isLeap": false }, "11-12": { "month": 10, "day": 4, "isLeap": false }, "11-13": { "month": 10, "day": 5, "isLeap": false }, "11-14": { "month": 10, "day": 6, "isLeap": false }, "11-15": { "month": 10, "day": 7, "isLeap": false }, "11-16": { "month": 10, "day": 8, "isLeap": false }, "11-17": { "month": 10, "day": 9, "isLeap": false }, "11-18": { "month": 10, "day": 10, "isLeap": false }, "11-19": { "month": 10, "day": 11, "isLeap": false }, "11-20": { "month": 10, "day": 12, "isLeap": false }, "11-21": { "month": 10, "day": 13, "isLeap": false }, "11-22": { "month": 10, "day": 14, "isLeap": false }, "11-23": { "month": 10, "day": 15, "isLeap": false }, "11-24": { "month": 10, "day": 16, "isLeap": false }, "11-25": { "month": 10, "day": 17, "isLeap": false }, "11-26": { "month": 10, "day": 18, "isLeap": false }, "11-27": { "month": 10, "day": 19, "isLeap": false }, "11-28": { "month": 10, "day": 20, "isLeap": false }, "11-29": { "month": 10, "day": 21, "isLeap": false }, "11-30": { "month": 10, "day": 22, "isLeap": false }, "12-1": { "month": 10, "day": 23, "isLeap": false }, "12-2": { "month": 10, "day": 24, "isLeap": false }, "12-3": { "month": 10, "day": 25, "isLeap": false }, "12-4": { "month": 10, "day": 26, "isLeap": false }, "12-5": { "month": 10, "day": 27, "isLeap": false }, "12-6": { "month": 10, "day": 28, "isLeap": false }, "12-7": { "month": 10, "day": 29, "isLeap": false }, "12-8": { "month": 10, "day": 30, "isLeap": false }, "12-9": { "month": 11, "day": 1, "isLeap": false }, "12-10": { "month": 11, "day": 2, "isLeap": false }, "12-11": { "month": 11, "day": 3, "isLeap": false }, "12-12": { "month": 11, "day": 4, "isLeap": false }, "12-13": { "month": 11, "day": 5, "isLeap": false }, "12-14": { "month": 11, "day": 6, "isLeap": false }, "12-15": { "month": 11, "day": 7, "isLeap": false }, "12-16": { "month": 11, "day": 8, "isLeap": false }, "12-17": { "month": 11, "day": 9, "isLeap": false }, "12-18": { "month": 11, "day": 10, "isLeap": false }, "12-19": { "month": 11, "day": 11, "isLeap": false }, "12-20": { "month": 11, "day": 12, "isLeap": false }, "12-21": { "month": 11, "day": 13, "isLeap": false }, "12-22": { "month": 11, "day": 14, "isLeap": false }, "12-23": { "month": 11, "day": 15, "isLeap": false }, "12-24": { "month": 11, "day": 16, "isLeap": false }, "12-25": { "month": 11, "day": 17, "isLeap": false }, "12-26": { "month": 11, "day": 18, "isLeap": false }, "12-27": { "month": 11, "day": 19, "isLeap": false }, "12-28": { "month": 11, "day": 20, "isLeap": false }, "12-29": { "month": 11, "day": 21, "isLeap": false }, "12-30": { "month": 11, "day": 22, "isLeap": false }, "12-31": { "month": 11, "day": 23, "isLeap": false } };

/**
 * 양력 -> 음력 변환 (2026년 데이터 사용)
 */
function getLunarDate(year, month, day) {
    if (year !== 2026) return null;
    const key = `${month}-${day}`;
    return LUNAR_DATA_2026[key];
}

// ========== 일진 계산 ==========
// 기준일: 2026년 1월 1일 = 甲戌(갑술) - 60갑자 중 10번째 (인덱스 10)
const BASE_DATE = new Date(2026, 0, 1);
const BASE_GANJI_INDEX = 10; // 甲戌

/**
 * 특정 날짜의 일진(간지) 계산
 */
function getDailyGanji(year, month, day) {
    const targetDate = new Date(year, month - 1, day);
    const diffDays = Math.floor((targetDate - BASE_DATE) / (1000 * 60 * 60 * 24));
    const ganjiIndex = (BASE_GANJI_INDEX + diffDays) % 60;
    return GANJI_60[ganjiIndex >= 0 ? ganjiIndex : ganjiIndex + 60];
}

/**
 * 특정 월의 모든 일진 데이터 생성
 */
function getMonthlyGanji(year, month) {
    const daysInMonth = new Date(year, month, 0).getDate();
    const result = [];

    for (let day = 1; day <= daysInMonth; day++) {
        result.push({
            day: day,
            ganji: getDailyGanji(year, month, day)
        });
    }

    return result;
}

// ========== 일별 특정 이슈 판단 ==========

/**
 * 일별 특정 이슈(사업운, 이동수, 재물운, 문서운 등) 판단
 * @param {string} ilgan 일간 (예: "丙")
 * @param {string} dailyGanji 일진 간지 (예: "甲子")
 * @param {object} monthData 월운 데이터
 * @returns {array} 해당일의 이슈 배열
 */
function getDailyIssues(ilgan, dailyGanji, monthData) {
    const dailyCheongan = dailyGanji[0];
    const dailyJiji = dailyGanji[1];

    const ilganOheng = CHEONGAN_OHENG[ilgan];
    const dailyCheonganOheng = CHEONGAN_OHENG[dailyCheongan];
    const dailyJijiOheng = JIJI_OHENG[dailyJiji];

    const issues = [];

    // 1. 재물운 (편재/정재 관련)
    // 일간이 극하는 오행 = 재물
    if (
        (ilganOheng === '木' && dailyJijiOheng === '土') ||
        (ilganOheng === '火' && dailyJijiOheng === '金') ||
        (ilganOheng === '土' && dailyJijiOheng === '水') ||
        (ilganOheng === '金' && dailyJijiOheng === '木') ||
        (ilganOheng === '水' && dailyJijiOheng === '火')
    ) {
        issues.push({ type: 'wealth', label: '재물운', icon: '💰', color: 'text-yellow-600' });
    }

    // 2. 사업운 (편재 + 관성 조합)
    if (monthData && monthData.십성) {
        const sipseong = monthData.십성.split('/')[0];
        if ((sipseong === '편재' || sipseong === '정재') &&
            (dailyCheonganOheng === '土' || dailyJijiOheng === '土')) {
            issues.push({ type: 'business', label: '사업운', icon: '📈', color: 'text-green-600' });
        }
    }

    // 3. 이동수/여행운 (역마살 관련)
    // 역마지지: 寅申巳亥
    const yeokmaJiji = ['寅', '申', '巳', '亥'];
    if (yeokmaJiji.includes(dailyJiji)) {
        issues.push({ type: 'travel', label: '이동수', icon: '✈️', color: 'text-blue-500' });
    }

    // 4. 귀인운 (천을귀인, 문창귀인 등)
    // 일간을 생하는 오행 = 인성 = 귀인
    if (
        (ilganOheng === '火' && dailyCheonganOheng === '木') ||
        (ilganOheng === '土' && dailyCheonganOheng === '火') ||
        (ilganOheng === '金' && dailyCheonganOheng === '土') ||
        (ilganOheng === '水' && dailyCheonganOheng === '金') ||
        (ilganOheng === '木' && dailyCheonganOheng === '水')
    ) {
        issues.push({ type: 'noble', label: '귀인운', icon: '🤝', color: 'text-purple-600' });
    }

    // 5. 문서운/계약운 (정인 관련)
    if (monthData && monthData.십성) {
        const sipseong = monthData.십성.split('/')[0];
        if (sipseong === '정인' || sipseong === '편인') {
            if (dailyJiji === '卯' || dailyJiji === '巳' || dailyJiji === '酉') {
                issues.push({ type: 'document', label: '문서운', icon: '📝', color: 'text-indigo-600' });
            }
        }
    }

    // 6. 인기운/매력운 (도화살 관련)
    // 도화지지: 子午卯酉
    const dowhwaJiji = ['子', '午', '卯', '酉'];
    if (dowhwaJiji.includes(dailyJiji)) {
        if (monthData && monthData.신살 && monthData.신살.includes('도화살')) {
            issues.push({ type: 'charm', label: '인기운', icon: '⭐', color: 'text-pink-500' });
        }
    }

    // 7. 학습운/시험운 (화개살 관련)
    // 화개지지: 辰戌丑未
    const hwagaeJiji = ['辰', '戌', '丑', '未'];
    if (hwagaeJiji.includes(dailyJiji)) {
        if (monthData && monthData.신살 && monthData.신살.includes('화개살')) {
            issues.push({ type: 'study', label: '학습운', icon: '📚', color: 'text-cyan-600' });
        }
    }

    // 8. 변화운/도전운 (충 관련)
    if (monthData && monthData.신살 && monthData.신살.includes('충')) {
        issues.push({ type: 'change', label: '변화운', icon: '🔄', color: 'text-orange-500' });
    }

    // 9. 협력운 (합 관련)
    if (monthData && monthData.신살 && (monthData.신살.includes('합') || monthData.신살.includes('삼합'))) {
        if (dailyJiji === '子' || dailyJiji === '丑' || dailyJiji === '午' || dailyJiji === '未') {
            issues.push({ type: 'cooperation', label: '협력운', icon: '🤲', color: 'text-teal-600' });
        }
    }

    // 10. 건강 주의 (칠살, 급각살 등 흉살 날)
    const cautionDays = ['庚申', '辛酉', '甲寅', '乙卯'];
    // 일간을 극하는 날 = 관살 = 건강 주의
    if (
        (ilganOheng === '土' && dailyCheonganOheng === '木') ||
        (ilganOheng === '金' && dailyCheonganOheng === '火') ||
        (ilganOheng === '水' && dailyCheonganOheng === '土') ||
        (ilganOheng === '木' && dailyCheonganOheng === '金') ||
        (ilganOheng === '火' && dailyCheonganOheng === '水')
    ) {
        if (monthData && monthData.신살 && monthData.신살.includes('충')) {
            issues.push({ type: 'health', label: '건강주의', icon: '⚠️', color: 'text-red-500' });
        }
    }

    return issues;
}

// ========== 길운 판단 로직 ==========

/**
 * 일간(본인)과 일진의 관계로 길운 판단
 */
function calculateDailyLuck(ilgan, dailyGanji, monthData) {
    const dailyCheongan = dailyGanji[0];
    const dailyJiji = dailyGanji[1];

    const ilganOheng = CHEONGAN_OHENG[ilgan];
    const dailyCheonganOheng = CHEONGAN_OHENG[dailyCheongan];
    const dailyJijiOheng = JIJI_OHENG[dailyJiji];

    let score = 50; // 기본 점수
    let reasons = [];

    // 1. 월운 신살 영향
    if (monthData && monthData.신살) {
        if (monthData.신살.includes('합')) {
            if (dailyJiji === '子' || dailyJiji === '亥') {
                score += 20;
                reasons.push('수국합 길일');
            }
        }
        if (monthData.신살.includes('충')) {
            score -= 10;
            reasons.push('충 월 주의');
        }
        if (monthData.신살.includes('도화살')) {
            if (dailyJiji === '申' || dailyJiji === '酉') {
                score += 15;
                reasons.push('인기운 상승');
            }
        }
        if (monthData.신살.includes('화개살')) {
            if (dailyJiji === '寅' || dailyJiji === '卯') {
                score += 10;
                reasons.push('학문/사색운');
            }
        }
    }

    // 2. 월운 십성 영향
    if (monthData && monthData.십성) {
        const sipseong = monthData.십성.split('/')[0];

        if ((sipseong === '편재' || sipseong === '정재')) {
            if (dailyJijiOheng === '土') {
                score += 15;
                reasons.push('재물운 길일');
            }
        }

        if ((sipseong === '편관' || sipseong === '정관')) {
            if (dailyJijiOheng === '水') {
                score += 10;
                reasons.push('직장/명예운');
            }
        }

        if ((sipseong === '편인' || sipseong === '정인')) {
            if (dailyJijiOheng === '木') {
                score += 10;
                reasons.push('학습/문서운');
            }
        }

        if ((sipseong === '식신' || sipseong === '상관')) {
            if (dailyJijiOheng === '土') {
                score += 10;
                reasons.push('표현/창작운');
            }
        }
    }

    // 3. 일간과 일진 천간의 관계
    if (ilganOheng === dailyCheonganOheng) {
        // 점수 변동 없음
    }
    else if (
        (ilganOheng === '木' && dailyCheonganOheng === '火') ||
        (ilganOheng === '火' && dailyCheonganOheng === '土') ||
        (ilganOheng === '土' && dailyCheonganOheng === '金') ||
        (ilganOheng === '金' && dailyCheonganOheng === '水') ||
        (ilganOheng === '水' && dailyCheonganOheng === '木')
    ) {
        score += 5;
    }
    else if (
        (ilganOheng === '火' && dailyCheonganOheng === '木') ||
        (ilganOheng === '土' && dailyCheonganOheng === '火') ||
        (ilganOheng === '金' && dailyCheonganOheng === '土') ||
        (ilganOheng === '水' && dailyCheonganOheng === '金') ||
        (ilganOheng === '木' && dailyCheonganOheng === '水')
    ) {
        score += 10;
        reasons.push('귀인 기운');
    }
    else if (
        (ilganOheng === '木' && dailyCheonganOheng === '土') ||
        (ilganOheng === '火' && dailyCheonganOheng === '金') ||
        (ilganOheng === '土' && dailyCheonganOheng === '水') ||
        (ilganOheng === '金' && dailyCheonganOheng === '木') ||
        (ilganOheng === '水' && dailyCheonganOheng === '火')
    ) {
        score += 8;
    }
    else if (
        (ilganOheng === '土' && dailyCheonganOheng === '木') ||
        (ilganOheng === '金' && dailyCheonganOheng === '火') ||
        (ilganOheng === '水' && dailyCheonganOheng === '土') ||
        (ilganOheng === '木' && dailyCheonganOheng === '金') ||
        (ilganOheng === '火' && dailyCheonganOheng === '水')
    ) {
        score -= 5;
    }

    // 4. 특수 길일 판단
    const specialGoodDays = ['甲子', '甲午', '丙寅', '丙午', '戊辰', '庚申', '壬子'];
    if (specialGoodDays.includes(dailyGanji)) {
        score += 10;
        reasons.push('특수 길일');
    }

    // 5. 주의일 판단 (천간 충돌)
    const chungPairs = [['甲', '庚'], ['乙', '辛'], ['丙', '壬'], ['丁', '癸']];
    for (const pair of chungPairs) {
        if ((ilgan === pair[0] && dailyCheongan === pair[1]) ||
            (ilgan === pair[1] && dailyCheongan === pair[0])) {
            score -= 15;
            reasons.push('천간충 주의');
            break;
        }
    }

    // 일별 이슈 가져오기
    const dailyIssues = getDailyIssues(ilgan, dailyGanji, monthData);

    // 점수를 등급으로 변환
    let luck, symbol, colorClass;
    if (score >= 70) {
        luck = 'great';
        symbol = '★';
        colorClass = 'luck-great';
    } else if (score >= 55) {
        luck = 'good';
        symbol = '◎';
        colorClass = 'luck-good';
    } else if (score >= 40) {
        luck = 'normal';
        symbol = '○';
        colorClass = 'luck-normal';
    } else {
        luck = 'caution';
        symbol = '△';
        colorClass = 'luck-caution';
    }

    return {
        score: score,
        luck: luck,
        symbol: symbol,
        colorClass: colorClass,
        reasons: reasons,
        ganji: dailyGanji,
        jijiName: JIJI_NAME[dailyJiji],
        issues: dailyIssues // 일별 특정 이슈 추가
    };
}

// ========== 월운 요약 생성 ==========

function generateMonthSummary(monthData, ilgan, year, month) {
    const sipseong = monthData.십성.split('/');
    const mainSipseong = sipseong[0];

    const keywordMap = {
        '비견': { keyword: '경쟁/자립', advice: '주체적인 활동이 좋습니다' },
        '겁재': { keyword: '도전/경쟁', advice: '과한 욕심은 금물입니다' },
        '식신': { keyword: '재능/건강', advice: '창작과 표현에 좋은 달입니다' },
        '상관': { keyword: '표현/변화', advice: '새로운 시도가 유리합니다' },
        '편재': { keyword: '투자/사업', advice: '재물 활동이 활발합니다' },
        '정재': { keyword: '안정/저축', advice: '꾸준한 노력이 결실을 맺습니다' },
        '편관': { keyword: '변화/도전', advice: '급격한 변화에 대비하세요' },
        '정관': { keyword: '승진/명예', advice: '직장에서 인정받는 시기입니다' },
        '편인': { keyword: '학습/자격', advice: '공부와 자기계발에 좋습니다' },
        '정인': { keyword: '문서/계약', advice: '계약과 시험에 유리합니다' }
    };

    const info = keywordMap[mainSipseong] || { keyword: '-', advice: '-' };

    // 길운 포인트 날짜 계산
    const monthlyData = getMonthlyGanji(year, month);
    const goodDays = [];
    const cautionDays = [];

    // 이슈별 날짜 집계
    const issuesByType = {};

    monthlyData.forEach(d => {
        const luckInfo = calculateDailyLuck(ilgan, d.ganji, monthData);
        if (luckInfo.luck === 'great') {
            goodDays.push(d.day);
        } else if (luckInfo.luck === 'caution') {
            cautionDays.push(d.day);
        }

        // 이슈별 집계
        luckInfo.issues.forEach(issue => {
            if (!issuesByType[issue.type]) {
                issuesByType[issue.type] = { label: issue.label, icon: issue.icon, days: [] };
            }
            issuesByType[issue.type].days.push(d.day);
        });
    });

    // 신살 해석
    let sinsalNote = '';
    if (monthData.신살 && monthData.신살 !== '-') {
        if (monthData.신살.includes('합')) sinsalNote += '협력운 상승, ';
        if (monthData.신살.includes('충')) sinsalNote += '변화/이동 암시, ';
        if (monthData.신살.includes('도화살')) sinsalNote += '매력/인기 상승, ';
        if (monthData.신살.includes('화개살')) sinsalNote += '영감/예술 감각, ';
        if (monthData.신살.includes('역마살')) sinsalNote += '이동/변동 가능, ';
        sinsalNote = sinsalNote.slice(0, -2);
    }

    return {
        ganji: monthData.간지,
        sipseong: monthData.십성,
        sinsal: monthData.신살,
        keyword: info.keyword,
        advice: info.advice,
        goodDays: goodDays.slice(0, 5),
        cautionDays: cautionDays.slice(0, 3),
        sinsalNote: sinsalNote,
        issuesByType: issuesByType // 이슈별 날짜 정보 추가
    };
}

// ========== 달력 데이터 생성 ==========

function generateCalendarData(year, month, ilgan, monthData) {
    const firstDay = new Date(year, month - 1, 1).getDay();
    const daysInMonth = new Date(year, month, 0).getDate();

    const calendar = {
        year: year,
        month: month,
        firstDay: firstDay,
        daysInMonth: daysInMonth,
        days: [],
        summary: generateMonthSummary(monthData, ilgan, year, month)
    };

    for (let day = 1; day <= daysInMonth; day++) {
        const ganji = getDailyGanji(year, month, day);
        const luckInfo = calculateDailyLuck(ilgan, ganji, monthData);
        const lunarDate = getLunarDate(year, month, day);

        calendar.days.push({
            day: day,
            ganji: ganji,
            lunar: lunarDate,
            ...luckInfo
        });
    }

    return calendar;
}

// 모듈 내보내기 (전역 사용)
window.SajuCalendar = {
    getLunarDate,
    getDailyGanji,
    getMonthlyGanji,
    getDailyIssues,
    calculateDailyLuck,
    generateMonthSummary,
    generateCalendarData,
    CHEONGAN,
    JIJI,
    GANJI_60,
    CHEONGAN_OHENG,
    JIJI_OHENG,
    JIJI_NAME
};
