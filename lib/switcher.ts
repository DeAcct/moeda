// T는 전체 유니온 타입, R은 반환 타입
/**
 * 복잡한 조건에 따라 분기 처리를 수행하고 결과값을 반환하는 함수형 유틸리티입니다.
 * * 순수 switch문이나 if-else 체인과 달리, '표현식'으로 동작하여 최종 값을 바로 반환할 수 있습니다.
 * * 각 조건(case)은 boolean을 반환하는 predicate 함수로 정의됩니다.
 * * 단순 값 비교를 넘어 연립부등식과 같은 복잡한 비즈니스 로직을 명료하게 표현할 수 있습니다.
 * @template T - 검사의 대상이 되는 값(`value`)의 타입.
 * @template R - 각 `case` 또는 `default`에서 최종적으로 반환될 값의 타입.
 * @param value - 조건들을 판별할 대상 값입니다.
 * @returns 메서드 체이닝이 가능한 `case`와 `default` 메서드를 포함하는 객체.
 * @example
 * const getCharacterState = (hp, stamina) =>
 * switcher({ hp, stamina })
 * .case(stats => stats.hp < 20 && stats.stamina < 10, '위험')
 * .case(stats => stats.stamina < 30, '지침')
 * .default('안정');
 * const myState = getCharacterState(80, 25); // '지침'
 */
export const switcher = <T, R>(value: T) => {
  const toFn = (maybeFn: ((value: T) => R) | R): ((value: T) => R) =>
    typeof maybeFn === "function"
      ? (maybeFn as (value: T) => R)
      : () => maybeFn;

  const cases: { predicate: (value: T) => boolean; action: (value: T) => R }[] = [];

  const chain = {
    // T_Case는 T의 부분집합. 즉, 가능한 조건 중 하나.
    case<T_Case extends T>(
      predicate: (value: T) => value is T_Case,
      actionOrValue: ((value: T_Case) => R) | R
    ) {
      // `cases` 배열은 `(value: T) => R` 타입의 액션 함수를 기대하지만,
      // 여기서 받는 `actionOrValue`는 타입 가드를 통과한 `(value: T_Case) => R` 타입입니다.
      // 이 타입 불일치를 해소하기 위해 `as any`를 사용합니다.
      //
      // 이 `any`는 `default` 메서드의 실행 로직에 의해 안전성이 보장됩니다.
      // `find`를 통해 `predicate`와 `action`이 항상 쌍으로 호출되므로,
      // `action` 함수는 항상 올바른 타입의 값을 받게 됩니다.
      //
      // 타입스크립트: 야, 너 A번 방에 B열쇠 넣어서 뿐지를 일 있냐? 그냥 마스터키만 넣어
      // 사용자: 내가 짬이 얼마인데... 알아서 대조(cases.find) 할 테니까 안심해
      cases.push({
        predicate,
        action: toFn(actionOrValue as any)
      });
      return chain;
    },

    default(fallbackOrValue: ((value: T) => R) | R): R {
      const match = cases.find(({ predicate }) => predicate(value));
      return (match?.action ?? toFn(fallbackOrValue))(value);
    },
  };

  return chain;
};