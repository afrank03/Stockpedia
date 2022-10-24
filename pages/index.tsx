import type { NextPage } from "next";
import Head from "next/head";
import { ChangeEvent, useState, useEffect } from "react";
import styles from "./index.module.css";

interface DSLExample {
  id: string;
  label: string;
  dsl: string;
}

// API Section some of the stuff from here would be in a proper API client domain
const apiUrl = "http://localhost:3000/api/calculate";

const examples: readonly DSLExample[] = [
  {
    id: "multiply",
    label: "Simple multiplication",
    dsl: `{
  "expression": {"fn": "*", "a": "sales", "b": 2},
  "security": "ABC"
}`,
  },
  {
    id: "divide",
    label: "Simple division",
    dsl: `{
  "expression": {"fn": "/", "a": "price", "b": "eps"},
  "security": "BCD"
}`,
  },
  {
    id: "nested",
    label: "Nested expression",
    dsl: `{
  "expression": {
    "fn": "-", 
    "a": {"fn": "-", "a": "eps", "b": "shares"}, 
    "b": {"fn": "-", "a": "assets", "b": "liabilities"}
  },
  "security": "CDE"
}`,
  },
  {
    id: "invalid-json",
    label: "Invalid JSON",
    dsl: `{
  "expression": {"fn": "+", "a": "price", "b": "eps"},
  "security": "BCD"
`,
  },
  {
    id: "invalid-dsl",
    label: "Invalid DSL",
    dsl: `{
  "wrong": 123,
  "security": "BCD"
}`,
  },
  {
    id: "missing-security",
    label: "Missing security",
    dsl: `{
  "expression": {"fn": "*", "a": "sales", "b": 2},
  "security": "ZZZ"
}`,
  },
];

const Home: NextPage = () => {
  const [expression, setExpression] = useState<string>(examples[0].dsl);
  const [calculatedOutput, setCalculatedOutput] = useState<number>(0);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  // A little bit breaking Single responsability here
  // Ideally these three Sets should be separated
  const setDslAndResetOutput = (dsl: string) => () => {
    setExpression(dsl);
    setCalculatedOutput(0);
    resetMessage();
  }

  const resetMessage = () => {
    setSuccess(false);
    setError(false);
  }

  const fetchData = async (body: string) => {
    // This obvisouly is an ugly way to fetch. Normally you would have a dedicated API clients which would allow us to make clean requests.
    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
        body: body
      })

      const json = await res.json();

      return json;
    } catch(error) {
      // Obviously we can do much better error handling here. As well as Log them etc. 
      const json = {value: 0, error: true};
      return json;
    }
  };

  const calc = async () => {
    const response = await fetchData(expression);
    
    setCalculatedOutput(response.value); 
    setError(response.error);
    setSuccess(!response.error);
}

  const message = () => {
    if (!success && !error) return;

    if (error) {
      return (
        <div className={[styles.message, styles.messageError].join(" ")}>
          There is a problem with your DSL query.
        </div>
      )
    }

    return (
      <div className={[styles.message, styles.messageSuccess].join(" ")}>
        DSL query ran successfully!
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Stockopedia facts challenge</title>
        <meta
          name="description"
          content="Coding challenge for Stockopedia Ltd"
        />
      </Head>

      <main className={styles.container}>
        <h1>Welcome to facts!</h1>
        <p>
          Enter the DSL query below and press the{" "}
          <strong>
            <q>run</q>
          </strong>{" "}
          button to evaluate it.
        </p>

        {/* Pre-canned Examples Section */}
        <div className={styles.section}>
          <p id="pre-canned-description">
            <strong>Pre-canned examples:</strong>
          </p>
          <nav
            className={styles.navigation}
            aria-describedby="pre-canned-description"
          >
            {examples.map(({ id, label, dsl }) => (
              <button
                type="button"
                onClick={setDslAndResetOutput(dsl)}
                key={id}
                data-testid={`button-${id}`}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* DSL Editor Section */}
        <div className={styles.section}>
          <label htmlFor="dsl-expression">DSL Expression:</label>
          <textarea
            id="dsl-expression"
            className={styles.field}
            data-testid="expression-input"
            placeholder="Enter your DSL"
            value={expression}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setExpression(e.target.value)
            }
            rows={8}
          ></textarea>

          {message()}

          <button 
            data-testid="run-button" 
            type="button"
            onClick={calc}>
            Run
          </button>
        </div>

        {/* DSL Output Section */}
        <div className={styles.section}>
          <label htmlFor="dsl-output">Output:</label>
          <textarea
            id="dsl-output"
            data-testid="dsl-output" 
            className={styles.field}
            readOnly
            rows={1}
            value={calculatedOutput}
          ></textarea>
        </div>
      </main>
    </>
  );
};

export default Home;
