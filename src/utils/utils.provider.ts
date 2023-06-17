import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilsProvider {
  excludeObjectOptions<Obj extends object>(obj: Obj, keys: (keyof Obj)[]): Obj {
    const objCopy = this.deepCopy<Obj>(obj);

    keys.forEach((key) => {
      delete objCopy[key];
    });

    return objCopy;
  }

  deepCopy<Obj extends object>(obj: Obj): Obj {
    return JSON.parse(JSON.stringify(obj));
  }
}
