import { MaytrixXClient } from "./domain/MaytrixXClient";
import { config as dotenv } from "dotenv";
import { MaytrixXConfig} from "./domain/MaytrixXConfig";
import config from "./domain/MaytrixXConfig";

dotenv({path: __dirname + "/../src/.env"});

interface IGlobalVar {
    __CLIENT__: boolean;
    __SERVER__: boolean;
    __DEV__: boolean;
    __TEST__: boolean;
    bot : MaytrixXClient;
}

declare global
{
	interface NodeModule
	{
		hot: {
			accept: Function
		}
	}

	namespace NodeJS {
		interface Global extends IGlobalVar {  }
	}

	interface Window extends IGlobalVar {
		__REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
		__PRELOADED_STATE__: any;
    }

    interface Array<T>
    {
        flat(depth : number) : any[];
    }
}


String.prototype.replaceAll = function(find : string, replace : string)
{
    return this.replace(new RegExp(find, 'g'), replace);
}

String.prototype.toProperCase = function()
{
    return this.replace(/([^\W_]+[^\s-]*) */g, (txt : string) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

String.prototype.Truncate = function(maxLength : number, side : string, ellipsis : string = "...") : string
{
    var str = this;
    if(str.length > maxLength)
    {
        switch(side)
        {
            case "start":
                {
                    return ellipsis + str.slice(-(maxLength - ellipsis.length));
                }
            case "end":
                {
                    return str.slice(0, maxLength - ellipsis.length) + ellipsis;
                }
        }
    }
    return str.toString();
};

Array.prototype.flat = function(depth = 1)
{
    return this.reduce((flat, toFlatten) => {
        return flat.concat((Array.isArray(toFlatten) && (depth>1)) ? toFlatten.flat(depth-1) : toFlatten);
    }, []);
}

global.bot = new MaytrixXClient(<MaytrixXConfig>config);