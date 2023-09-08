type keys = { [key: string]: any };

export class Utils {
  static MakeSetValue = (keys: keys) => {
    const params = [];
    const madeSet = Object.entries(keys).map((value, i) => {
      params.push(value[1]);
      return `${value[0]}=$${i + 2}`;
    });

    return {
      params,
      keys: madeSet,
    };
  };

  static GetRandomFromArray = <T>(array: T[]): T => {
    return array[Math.floor(Math.random() * array.length)];
  };

  static WaitGroup = (count: number) => {
    let resolveFn;
    const promise = new Promise((resolve) => (resolveFn = resolve));

    return {
      add: () => {
        count++;
      },
      done: () => {
        count--;
        if (count === 0) resolveFn();
      },
      wait: () => promise,
    };
  };
}
