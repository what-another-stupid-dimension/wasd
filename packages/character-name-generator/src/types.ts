export enum Gender {
    Male = 'male',
    Female = 'female',
    Nonbinary = 'nonbinary',
}

export enum Locale {
    En = 'en',
    De = 'de',
}

export interface Dictionary {
    title: string[],
    adjective: string[],
    firstName: string[],
    lastName: string[],
}

export type GenderBasedDictionary = {
    [key in Gender]: Dictionary
}

export type LocaleBasedDictionary = {
    [key in Locale]: GenderBasedDictionary
}

export type GenrateSettings = {
    title: boolean | number,
    adjective: boolean | number,
    lastName: boolean,
    gender?: Gender,
    doubleFirstName?: boolean | number,
    firstNameDelimeters?: string[],
}

export type Name = {
    title?: string,
    adjective?: string,
    firstName: string,
    lastName?: string,
}

export type FormatFn = (name: Name, gender: Gender) => string

export enum Format {
    Short = 'short',
    Long = 'long',
}

export type Formatter = {
    short: FormatFn,
    long: FormatFn,
}
