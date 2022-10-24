import { getAttributeByName } from './dataMapper'
import { Fact } from '../../../models/fact';
import { sumArguments } from './operators';

type Operator = '+' | '-' | '*' | '\\';

export interface DSLExpression {
    fn: Operator, 
    a: string | number | DSLExpression, 
    b: string | number | DSLExpression
}

export interface DSL {
    expression: DSLExpression,
    security: string
}

export const getAttributeValue = (atr: string | number, facts: Fact[]): number => {
    if (typeof atr === 'object') {
        atr = JSON.stringify(atr);

        return applyExpression(atr, facts)
    } else if (typeof atr === 'string') {
        const atrribute = getAttributeByName(atr);
        const fact = facts.find((fact: Fact) => fact.attribute_id === atrribute?.id);
        return fact?.value ?? 0;
    } else {
        return atr;
    }
};

export const applyExpression = (expression: string, facts: Fact[]): number => {
    const exp: DSLExpression = JSON.parse(expression); 

    return exp.fn === "+" ? sumArguments(exp.a, exp.b, facts) : 0;
}
