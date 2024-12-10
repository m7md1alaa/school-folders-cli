export function validateUniversityYear(input: string): true | string {
  const regex = /^(20\d{2})-(20\d{2})$/;
  if (!regex.test(input)) {
    return 'Please enter a valid Gregorian year range (e.g., 2023-2024).';
  }
  
  const [startYear, endYear] = input.split('-').map(Number);
  if (endYear !== startYear + 1) {
    return 'The end year should be exactly one year after the start year.';
  }
  
  return true;
}