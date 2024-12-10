export type Language = 'en' | 'ar';

export type HighSchoolYear = 'first' | 'second' | 'third';
export interface Subject {
  en: string;
  ar: string;
  elective?: boolean;
}
export type HighSchoolTrack = 'general' | 'cs' | 'health' | 'business' | 'shariah' | null;

export type EducationType = 'university' | 'highschool';

export interface ProgramOptions {
  language?: Language;
  output?: string;
  year?: string;
  educationType?: EducationType;
  highSchoolYear?: HighSchoolYear;
  track?: HighSchoolTrack;
  semesters?: string;
  additionalFolders?: string;
  quiet?: boolean;
  force?: boolean;
  edit?: boolean;
}