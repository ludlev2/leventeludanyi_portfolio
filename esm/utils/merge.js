/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { isPlainObject } from './lodash.merge';
var MAX_LEVEL = 20;
/**
 * Merges objects together
 * @param args - objects / values to be merged
 */
export function merge() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var result = args.shift();
    var objects = new WeakMap();
    while (args.length > 0) {
        result = mergeTwoObjects(result, args.shift(), 0, objects);
    }
    return result;
}
function takeValue(value) {
    if (isArray(value)) {
        return value.slice();
    }
    return value;
}
/**
 * Merges two objects
 * @param one - first object
 * @param two - second object
 * @param level - current deep level
 * @param objects - objects holder that has been already referenced - to prevent
 * cyclic dependency
 */
function mergeTwoObjects(one, two, level, objects) {
    if (level === void 0) { level = 0; }
    var result;
    if (level > MAX_LEVEL) {
        return undefined;
    }
    level++;
    if (isPrimitive(one) || isPrimitive(two) || isFunction(two)) {
        result = takeValue(two);
    }
    else if (isArray(one)) {
        result = one.slice();
        if (isArray(two)) {
            for (var i = 0, j = two.length; i < j; i++) {
                result.push(takeValue(two[i]));
            }
        }
        else if (isObject(two)) {
            var keys = Object.keys(two);
            for (var i = 0, j = keys.length; i < j; i++) {
                var key = keys[i];
                result[key] = takeValue(two[key]);
            }
        }
    }
    else if (isObject(one)) {
        if (isObject(two)) {
            if (!shouldMerge(one, two)) {
                return two;
            }
            result = Object.assign({}, one);
            var keys = Object.keys(two);
            for (var i = 0, j = keys.length; i < j; i++) {
                var key = keys[i];
                var twoValue = two[key];
                if (isPrimitive(twoValue)) {
                    if (typeof twoValue === 'undefined') {
                        delete result[key];
                    }
                    else {
                        // result[key] = takeValue(twoValue);
                        result[key] = twoValue;
                    }
                }
                else {
                    var obj1 = result[key];
                    var obj2 = twoValue;
                    if (wasObjectReferenced(one, key, objects) ||
                        wasObjectReferenced(two, key, objects)) {
                        delete result[key];
                    }
                    else {
                        if (isObject(obj1) && isObject(obj2)) {
                            var arr1 = objects.get(obj1) || [];
                            var arr2 = objects.get(obj2) || [];
                            arr1.push({ obj: one, key: key });
                            arr2.push({ obj: two, key: key });
                            objects.set(obj1, arr1);
                            objects.set(obj2, arr2);
                        }
                        result[key] = mergeTwoObjects(result[key], twoValue, level, objects);
                    }
                }
            }
        }
        else {
            result = two;
        }
    }
    return result;
}
/**
 * Function to check if object has been already reference
 * @param obj
 * @param key
 * @param objects
 */
function wasObjectReferenced(obj, key, objects) {
    var arr = objects.get(obj[key]) || [];
    for (var i = 0, j = arr.length; i < j; i++) {
        var info = arr[i];
        if (info.key === key && info.obj === obj) {
            return true;
        }
    }
    return false;
}
function isArray(value) {
    return Array.isArray(value);
}
function isFunction(value) {
    return typeof value === 'function';
}
function isObject(value) {
    return !isPrimitive(value) && !isArray(value) && !isFunction(value) && typeof value === 'object';
}
function isPrimitive(value) {
    return typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean' ||
        typeof value === 'undefined' ||
        value instanceof Date ||
        value instanceof RegExp ||
        value === null;
}
function shouldMerge(one, two) {
    if (!isPlainObject(one) || !isPlainObject(two)) {
        return false;
    }
    return true;
}
//# sourceMappingURL=merge.js.map