function toProperCase(str : string)
{
        return str.replace(/([^\W_]+[^\s-]*) */g, (txt : string) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

export default toProperCase;