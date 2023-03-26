/**
 * *BloodClothingType*
 *
 * TODO: Document. -Jab, 3/5/2023
 *
 * @author Jab
 */
export type BloodClothingType =
    | 'Jacket'
    | 'LongJacket'
    | 'Trousers'
    | 'ShortsShort'
    | 'Shirt'
    | 'ShirtLongSleeves'
    | 'ShirtNoSleeves'
    | 'Jumper'
    | 'JumperNoSleeves'
    | 'Shoes'
    | 'FullHelmet'
    | 'Apron'
    | 'Bag'
    | 'Hands'
    | 'Head'
    | 'Neck'
    | 'UpperBody'
    | 'LowerBody'
    | 'LowerLegs'
    | 'UpperLegs'
    | 'LowerArms'
    | 'UpperArms'
    | 'Groin';

/**
 * *ScriptBloodClothingTypes*
 *
 * TODO: Document. -Jab, 3/5/2023
 *
 * @author Jab
 */
export type ScriptBloodClothingTypes = BloodClothingType[] | undefined;
