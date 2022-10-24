import { getAttributeValue } from './utils'
import { Fact } from './../../../models/fact'

// Operator functions
export const sumArguments = (a: string | number, b: string | number, facts: Fact[]) => {
    const atrA = getAttributeValue(a, facts);
    const atrB = getAttributeValue(b, facts);

    return atrA + atrB;
}