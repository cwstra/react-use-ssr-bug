import { Suspense, use } from "react";

export default function Home() {
  console.log("Rendering home");
  return (
    <div>
      <Suspense fallback="Loading">
        <DisplayPromiseBug />
      </Suspense>
    </div>
  );
}

const fst = "This is my first value";
const snd = "This is my second value";
const delayedValue = async (value: string) => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return value;
};

// If this were a _useRef_, all would be well,
// but as a mutable variable, it fails.
let promises: "both" | "snd" | "neither" = "both";

const DisplayPromiseBug = () => {
  const firstMaybePromise = (() => {
    if (promises !== "both") return fst;
    return delayedValue(fst);
  })();
  const secondPromise = (() => {
    if (promises === "both") {
      promises = "snd";
      return delayedValue(snd);
    } else if (promises === "snd") {
      promises = "neither";
      return delayedValue(snd);
    }
    return snd;
  })();
  const firstValue =
    typeof firstMaybePromise === "string"
      ? firstMaybePromise
      : use(firstMaybePromise);
  const secondValue =
    typeof secondPromise === "string" ? secondPromise : use(secondPromise);

  console.log("Bugged", { firstValue, secondValue });

  return (
    <>
      <h1 className="font-bold">This example fails</h1>
      <p className="pb-10">
        It prints "This is my first message" twice in the console
      </p>
      <div>{firstValue}</div>
      <div>{secondValue}</div>
    </>
  );
};
