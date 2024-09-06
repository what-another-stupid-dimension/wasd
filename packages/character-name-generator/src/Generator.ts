import { defaultGenerateSettings, localedFormatter } from './constants'
import { fairyGibberish, medieval, medievalGibberish } from './dictionary'
import {
    Dictionary,
    Gender,
    GenderBasedDictionary,
    GenrateSettings,
    Locale,
    LocaleBasedDictionary,
    Name,
} from './types'

export default class NameGenerator {
    private dictionary: GenderBasedDictionary

    constructor(
        private locale: Locale = Locale.En,
        dictionaries: LocaleBasedDictionary[] = [medieval, medievalGibberish, fairyGibberish],
    ) {
        this.dictionary = this.accumulateDictionaries(dictionaries.map((d) => d[this.locale]))
    }

    generate(settings: GenrateSettings = defaultGenerateSettings): Name {
        const gender = settings.gender || this.getRandomGender()
        const name: Name = {
            firstName: this.generateFirstName(
                gender,
                settings.doubleFirstName || defaultGenerateSettings.doubleFirstName,
                settings.firstNameDelimeters || defaultGenerateSettings.firstNameDelimeters,
            ),
        }

        const generatedTitle = this.generateTitle(gender, settings.title)
        if (generatedTitle) name.title = generatedTitle

        const generatedAdjective = this.generateAdjective(gender, settings.adjective)
        if (generatedAdjective) name.adjective = generatedAdjective

        if (settings.lastName) name.lastName = this.generateLastName(gender)

        return name
    }

    generateString(
        settings: GenrateSettings = defaultGenerateSettings,
        formatter?: (name: Name, gender: Gender) => string,
    ): string {
        const gender = settings.gender || this.getRandomGender()
        formatter = formatter ?? localedFormatter[this.locale]
        return formatter(this.generate(settings), gender)
    }

    private generateTitle(gender: Gender, chance: boolean | number): string | undefined {
        if (chance === false) return undefined
        if (chance === true) chance = 1

        return Math.random() < chance
            ? this.getRandomFromDictionary(gender, 'title')
            : undefined
    }

    private generateAdjective(gender: Gender, chance: boolean | number): string | undefined {
        if (chance === false) return undefined
        if (chance === true) chance = 1

        return Math.random() < chance
            ? this.getRandomFromDictionary(gender, 'adjective')
            : undefined
    }

    private generateFirstName(
        gender: Gender,
        double: boolean | number,
        delimeters: string[],
    ): string {
        const iterations = double === true || (typeof double === 'number' && Math.random() < double) ? 2 : 1
        const nameParts: string[] = []

        for (let i = 0; i < iterations; i += 1) {
            nameParts.push(this.getRandomFromDictionary(gender, 'firstName'))
        }

        return nameParts.length === 1
            ? nameParts[0]
            : nameParts.join(delimeters[Math.floor(Math.random() * delimeters.length)])
    }

    private generateLastName(gender: Gender): string {
        return this.getRandomFromDictionary(gender, 'lastName')
    }

    private accumulateDictionaries(dictionaries: GenderBasedDictionary[]): GenderBasedDictionary {
        return Object.values(Gender).reduce((accumulator, gender) => ({
            ...accumulator,
            [gender]: dictionaries.reduce<Dictionary>((acc, dict) => ({
                title: [...acc.title, ...dict[gender].title].sort(),
                adjective: [...acc.adjective, ...dict[gender].adjective].sort(),
                firstName: [...acc.firstName, ...dict[gender].firstName].sort(),
                lastName: [...acc.lastName, ...dict[gender].lastName].sort(),
            }), {
                title: [], adjective: [], firstName: [], lastName: [],
            }),
        }), {} as GenderBasedDictionary)
    }

    private getRandomFromDictionary(gender: Gender, type: keyof Dictionary): string {
        const entries = this.dictionary[gender][type]
        return entries[Math.floor(Math.random() * entries.length)]
    }

    private getRandomGender(): Gender {
        const genders = Object.values(Gender)
        return genders[Math.floor(Math.random() * genders.length)]
    }
}
