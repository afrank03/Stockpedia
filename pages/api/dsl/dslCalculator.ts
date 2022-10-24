import { applyExpression } from './utils';
import { getFactsForSecurity } from './dataMapper';
import { DSL } from './utils';

export const calculateForDSL = (dsl: DSL) => {
    const securityFacts = getFactsForSecurity(dsl.security);
    const result = applyExpression(JSON.stringify(dsl.expression), securityFacts)
    
    return result;
};