/**
 * 20-1. strict mode란?
 *
 * 오타나 문법 지식의 미비로 인한 실수는 언제나 발생하며 이러한 오류를 줄이기 위한 환경을 만들기 위해 `strict mode`가 추가되었다.
 * `strict mode`는 ES5에 도입되었으며, ES6에서 도입된 `class`, `module`은 기본적으로 `strict mode`가 적용된다.
 *
 */

function foo() {
  x = 10;
}
foo();
console.log(x);
// 위의 코드는 `foo`함수를 정의하고 호출하였다.
// `foo`함수 내에는 선언하지 않는 `x` 변수에 10을 할당하는 명령을 했다.
// 이때 식별자로서의 `x`를 찾아야만 값을 할당할 수 있기 때문에 자바스크립트 엔진은 `x`가 어디에서 선언되었는지 스코프 체인을 따라 검색한다.
// 스코프 체인을 따라 결국 최상위의 전역 스코프에도 `x`의 선언이 존재하지 않기 때문에 ReferenceError를 발생시킬 것 같으나
// 자바스크립트 엔진은 전역 객체에 `x`프로퍼티를 동적으로 생성한다.
// 이 현상을 암묵적 전역(`implicit global`)이라 하며, 암묵적 전역은 오류를 발생시킬 가능성이 매우 높다.
// 위의 문제를 예방하기 위해서는 변수 선언을 확실히 하거나 `ESLint` 또는 `strict mode`를 사용할 수 있다.

function bar() {
  "use strict";
  y = 10;
}
// bar(); // ReferenceError: y is not defined ~

// 🔑 `strict mode`는 더 안전하고 예측할 수 있는 코드를 작성하기 위한 지시어이다.

/**
 * 20-2. strict mode의 적용
 *
 * `strict mode`를 적용하려면 전역의 선두(스크립트 파일) 또는 함수의 선두에 추가하면 된다.
 * ❗️ 스크립트 파일과 함수 몸체의 선두에 추가하지 않고 중간에 추가한다면 추가한 행을 기준으로 위의 코드들은 적용되지 않는다.
 *
 */

/**
 * 20-3. 전역에 strict mode를 적용하는 것은 피하자
 *
 * ❗️ `strict mode`가 적용된 스크립트와 외부 라이브러리의 호환성이 문제가 되거나 구형 브라우저에서 구동되야하는 앱의 경우에는 피해야 한다.
 *
 */

/**
 * 20-4. 함수 단위로 strict mode를 적용하는 것도 피하자
 *
 * 함수 단위로 `strict mode`를 사용할 수 있지만, 일일이 적용하는 것은 번거로운 일이고 외부 컨텍스트를 참조할 때 해당 컨텍스트가 `strict mode`가 아니라면 문제가 발생한다.
 * `즉시 실행 함수 단위`로 사용하는 것이 좋다, `즉시 실행 함수`는 전역 스코프의 변수나 함수를 차단하여 전역 변수를 오염시키지 않는다. (외부와 격리)
 * `strict mode` + `즉시 실행 함수`의 조합은 과거의 코드나 서드파티 라이브러리와의 호환성을 피하고 싶을 때 유용하다.
 *
 */

/**
 * 20-5. strict mode가 발생시키는 에러
 *
 * 1. 암묵적 전역(implicit global)
 * 2. 변수, 함수, 매개변수의 삭제
 * 3. 매개변수 이름의 중복
 * 4. `with`문 사용
 *
 */

// 20-5-1. 암묵적 전역
(function () {
  "use strict";
  // y = 1; // 🚨 ReferenceError: y is not defined ~
})();

// 20-5-2. 변수, 함수, 매개변수의 삭제 (`delete` 연산자로 변수, 함수, 매개변수 삭제 시 에러 발생)
(function () {
  "use strict";
  var x = 1;
  // delete x; // 🚨 SyntaxError: Delete of an unqualified identifier in strict mode. ~

  function bar(a) {
    // delete a // 🚨 SyntaxError: Delete of an unqualified identifier in strict mode. ~
  }

  // delete bar // 🚨 SyntaxError: Delete of an unqualified identifier in strict mode. ~
})();

// 20-5-3. 매개변수 이름의 중복
(function () {
  "use strict";
  // 🚨 SyntaxError: Duplicate parameter name not allowed in this context ~
  // function bar(x, x) {
  //   return x + x;
  // }
})();

// 20-5-4. with 문의 사용
(function () {
  "use strict";
  // with ({ x: 1 }) { } // 🚨 SyntaxError: Strict mode code may not include a with statement
})();

/**
 * 20-6. strict mode 적용에 의한 변화
 *
 * 1. 일반 함수의 this
 * 2. arguments 객체
 *
 */

// 20-6-1. 일반 함수의 this
// 생성자 함수로 사용이 가능한 [[Construct]] 내부 슬롯을 가진 `function declaration`, `function expression`의 경우
// `strict mode`와 `non strict`에서의 `this` 바인딩이 다르다.
// `strict mode`
//  - new 키워드가 없을 경우: undefined
//  - new 키워드가 있을 경우: 생성될 인스턴스
// `non strict`
//  - new 키워드가 없을 경우: 전역 객체
//  - new 키워드가 있을 경우: 생성될 인스턴스

(function () {
  "use strict";
  function foo() {
    console.log(this); // undefined
  }
  foo();

  function Bar() {
    console.log(this); // Bar {}
  }
  new Bar();
})();

// 20-6-2. arguments 객체
(function (a) {
  "use strict";
  a = 2;
  console.log(arguments); // `strict mode`: {0: 1, length: 1} , `non-strict`: {0: 2, length: 1}
})(1);
