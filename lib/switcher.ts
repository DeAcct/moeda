export const switcher = <T, R>(value: T) => {
  const toFn = (
    maybeFn: ((value: T) => R) | R
  ): ((value: T) => R) =>
    typeof maybeFn === "function"
      ? (maybeFn as (value: T) => R)
      : () => maybeFn;

  const cases: { predicate: (value: T) => boolean; action: (value: T) => R }[] =
    [];

  const chain = {
    case(
      predicate: (value: T) => boolean,
      actionOrValue: ((value: T) => R) | R
    ) {
      cases.push({ predicate, action: toFn(actionOrValue) });
      return chain;
    },
    default(fallbackOrValue: ((value: T) => R) | R) {
      return (this._match?.action ?? toFn(fallbackOrValue))(value);
    },
    exec(): R | undefined {
      return this._match?.action(value);
    },
    get _match() {
      return cases.find(({ predicate }) => predicate(value));
    },
  };

  return chain;
};
