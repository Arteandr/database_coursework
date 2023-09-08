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

  static GetRandomFromRange = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
}
