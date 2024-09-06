import { Gender, Name } from './types'

export const getDePronomen = (gender: Gender): string => {
    const pronouns: Record<Gender, string> = {
        [Gender.Female]: 'die',
        [Gender.Male]: 'der',
        [Gender.Nonbinary]: 'dey',
    }
    return pronouns[gender] || 'dey'
}

export const localedFormatter = {
    de: (name: Name, gender: Gender) => `${name.title ? `${name.title} ` : ''}${name.firstName}${name.lastName ? ` ${name.lastName}` : ''}${name.adjective ? ` ${getDePronomen(gender)} ${name.adjective}` : ''}`,
    en: (name: Name) => `${name.title ? `${name.title} ` : ''}${name.firstName}${name.lastName ? ` ${name.lastName}` : ''}${name.adjective ? `, the ${name.adjective}` : ''}`,
}

export const defaultGenerateSettings = {
    adjective: 0.05,
    lastName: true,
    title: 0.02,
    doubleFirstName: 0.3,
    firstNameDelimeters: [' ', '-'],
}
