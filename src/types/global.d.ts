import { MaytrixXClient } from "../domain/MaytrixXClient";

interface NodeModule {
  hot: {
    accept: Function;
  };
}

interface IGlobalVar {
  __CLIENT__: boolean;
  __SERVER__: boolean;
  __DEV__: boolean;
  __TEST__: boolean;
  bot: MaytrixXClient;
}

declare namespace NodeJS {
  interface Global extends IGlobalVar {  }
}

declare global
{
  interface String
  {
    Truncate(maxLength : number, side : string, ellipsis : string) : string;
    replaceAll(find : string, replace : string) : string;
    toProperCase() : string;
  }
}

interface Window extends IGlobalVar {
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
  __PRELOADED_STATE__: any;
}
