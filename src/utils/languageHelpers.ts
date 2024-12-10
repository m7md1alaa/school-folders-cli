import type { Language, HighSchoolYear } from '../types/index.js';

export function getSemesterName(semester: number, language: Language): string {
  if (language === 'ar') {
    const arabicSemesters = ['الترم الأول', 'الترم الثاني', 'الترم الثالث'];
    return arabicSemesters[semester - 1] || `الترم ${semester}`;
  }
  return `Semester_${semester}`;
}

export function getArabicYearName(year: HighSchoolYear): string {
  const arabicYears: Record<HighSchoolYear, string> = {
    first: 'أول ثانوي',
    second: 'ثاني ثانوي',
    third: 'ثالث ثانوي'
  };
  return arabicYears[year] || year;
}