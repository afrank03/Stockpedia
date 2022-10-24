// Data
import attributes from './../../../data/attributes.json';
import securities from './../../../data/securities.json';
import facts from '../../../data/facts.json';

// Interfaces
import { Attribute } from './../../../models/attribute';
import { Security } from './../../../models/security';
import { Fact } from './../../../models/fact';

// Data extraction and mapping
export const getAttributeByName = (name: string) => attributes.find((attribute: Attribute) => attribute.name === name) ?? null;
export const getSecurityBySymbol = (symbol: string) => securities.find((securitie: Security) => securitie.symbol === symbol) ?? null;
export const getFactsForSecurity = (symbol: string): Fact[] => {
    const security = getSecurityBySymbol(symbol);
    const factsForSymbol = facts.filter((fact) => {
        return fact.security_id === security?.id;
    });

    return factsForSymbol;
}