import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

//Convert prisma object into a regular JS object
export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

//Format number with decimal places
export function formatNumberWithComma(str: string): string {
  if (str.length > 3) {
    let str2 = str.slice(str.length - 3);
    for (let i = str.length - 4; i >= 0; i--) {
      if (i % 2 === 0) {
        str2 = str[i] + "," + str2;
        continue;
      }
      str2 = str[i] + str2;
    }
    return str2;
  }
  return str;
}
