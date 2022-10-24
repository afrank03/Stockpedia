// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { DSL } from "./dsl/utils";
import { calculateForDSL } from "./dsl/dslCalculator"

type Data = {
  value: number;
  error: boolean;
};

const isDSLType = (body: any): body is DSL => {
  return (body as DSL).expression !== undefined &&
    (body as DSL).security !== undefined;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  if (req.method === 'POST') {
    if (isDSLType(req.body)) {
      const DSL: DSL = req.body;
      const value = calculateForDSL(DSL);
      const response = {value, error: false} // Error part can be improved to be more exact on reasonining message etc.

      res.status(200).json(response);
    } else {
      res.status(400).json({ value: 0, error: true });
    }
  } else {
    // Handle any other HTTP method like GET, DELETE, PUT
  }
}
