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
}
