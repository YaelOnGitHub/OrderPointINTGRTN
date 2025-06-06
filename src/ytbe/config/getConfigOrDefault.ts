import { environment } from '../../environments/environment';

/**
 * Gets the a value from the specified configuration path, or a default value if no value exists.
 * @param path Path from which to retrieve the value
 * @param defaultValue Default value to use if no value exists
 */
export function getConfigOrDefault<T>(path: string[], defaultValue: T): T {
  let currObj: any = environment;

  //If any single portion of the path does not exist, then set result to undefined and exit.
  for (let i: number = 0; i < path.length; i++) {
    currObj = currObj[path[i]];
    if (currObj === undefined) {
      break;
    }
  }

  //If result is undefined, use default value
  return currObj !== undefined ? currObj : defaultValue; 
}
