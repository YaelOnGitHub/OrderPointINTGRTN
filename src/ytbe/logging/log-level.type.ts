//Used for compile type help
export type LogLevelType = "Critical" | "Debug" | "Error" | "Information" | "None" | "Trace" | "Warning";

//Basic String Enum & List implementation
export class LogLevelTypes {
    constructor(public value:LogLevelType, public name?:string){
        if (!name) this.name = value;
    }

    toString(){
        return this.name;
    }
    static readonly Critical = new LogLevelTypes("Critical");
    static readonly Debug = new LogLevelTypes("Debug");
    static readonly Error = new LogLevelTypes("Error");
    static readonly Information = new LogLevelTypes("Information");
    static readonly None = new LogLevelTypes("None");
    static readonly Trace = new LogLevelTypes("Trace");
    static readonly Warning = new LogLevelTypes("Warning");

    static readonly ALL:LogLevelTypes[] = [
        LogLevelTypes.Critical,
        LogLevelTypes.Debug,
        LogLevelTypes.Error,
        LogLevelTypes.Information,
        LogLevelTypes.None,
        LogLevelTypes.Trace,
        LogLevelTypes.Warning
    ];
    static getName(v:LogLevelType): string {
        return LogLevelTypes[v] ? LogLevelTypes[v].name ?? '' : '';
    }
}