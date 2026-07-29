import { registerDecorator, ValidationOptions, ValidateIf } from "class-validator"

export function CustomIsEmail(validationOptions?: ValidationOptions){
  return function(target: Object, propertyName: string){
    registerDecorator({
      name: "customIsEmail",
      target: target.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any){
            return typeof value === "string" && /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
        },
        defaultMessage(){
          return `Invalid Email Format`;
        },
      }
    })
  }
}

export function CustomIsAlpha(validationOptions?: ValidationOptions){
  return function(target: Object, propertyName: string){
    registerDecorator({
      name: "customIsAlpha",
      target: target.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any){
            return typeof value === "string" &&  value.trim() !== "" &&/^[A-Za-z]+$/.test(value.trim())
        },
        defaultMessage(){
          return `${propertyName} Must contain only letters`;
        }
      }
    })
  }
}

export function CustomMinLength(limit: number, validationOptions?: ValidationOptions){
  return function(target: Object, propertyName: string){
    registerDecorator({
      name: "customMinLength",
      target: target.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [limit],
      validator: {
        validate(value: any){
          return typeof value === "string" && value.length >= limit
        },
        defaultMessage(){
          return `${propertyName} must atleast ${limit} characters long`;
        }
      }
    })
  }
}

export function CustomIsNotEmpty(validationOptions?: ValidationOptions){
  return function(target: Object, propertyName: string){
    registerDecorator({
      name: 'customIsNotEmpty',
      target: target.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any){
          if(value === undefined || value === null) return false;
          return String(value).trim().length > 0;
        },
        defaultMessage(){
          return `${propertyName} cant be empty`
        }
      }
    })
  }
}

export function CustomIsOptional(validationOptions?: ValidationOptions){
  return function(target: Object, propertyName: string){
    ValidateIf((object: any) => {
      const value = object[propertyName];
        return value !== undefined && value !== null && value !== "";
    }, validationOptions)(target, propertyName);
  }
}

export function CustomIsString(validationOptions?: ValidationOptions){
  return function(target: Object, propertyName: string){
    registerDecorator({
      name: "customIsString",
      target: target.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any){
          return typeof value === "string"
        },
        defaultMessage(){
          return `${propertyName} must be a string`
        }
      }
    })
  }
}

export function CustomIsBoolean(validationOptions?: ValidationOptions){
  return function(target: Object, propertyName: string){
    registerDecorator({
      name: "customIsBoolean",
      target: target.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return typeof value === "boolean"
        },
        defaultMessage(){
          return `${propertyName} must be a boolean`
        }
      }
    })
  }
}

export function CustomIsInt(validationOptions?: ValidationOptions){
  return function(target: Object, propertyName: string){
    registerDecorator({
      name: "customIsInt",
      target: target.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any){
          return Number.isInteger(value)
        },
        defaultMessage(){
          return `${propertyName} must be an integer number`
        }
      }
    })
  }
}

export function CustomMin(minValue: number, validationOptions?: ValidationOptions){
  return function(target: Object, propertyName: string){
    registerDecorator({
      name: "customMin",
      target: target.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [minValue],
      validator: {
        validate(value: any){
          return typeof value === "number" && value >= minValue
        },
        defaultMessage(){
          return `${propertyName} must be greater than or equal to ${minValue}`
        },
      },
    })
  }
}

export function CustomMax(maxValue: number, validationOptions?: ValidationOptions){
  return function(target: Object, propertyName: string){
    registerDecorator({
      name: "customMax",
      target: target.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [maxValue],
      validator: {
        validate(value: any){
          return typeof value === "number" && value <= maxValue
        },
        defaultMessage() {
          return `${propertyName} must be less than or equal to ${maxValue}`
        }
      }
    })
  }
}

export function CustomIsArray(validationOptions?: ValidationOptions){
  return function(target: Object, propertyName: string){
    registerDecorator({
      name: "customIsArray",
      target: target.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return Array.isArray(value);
        },
        defaultMessage() {
          return `${propertyName} must be an array`
        }
      }
    })
  }
}

export function CustomIsEnum(entity: object, validationOptions?: ValidationOptions){
  return function(target: Object, propertyName: string){
    registerDecorator({
      name: "customIsEnum",
      target: target.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [entity],
      validator: {
        validate(value: any){
          return Object.values(entity).includes(value);
        },
        defaultMessage(){
          const validValues = Object.values(entity).join(", ")
          return `${propertyName} must be one of the following values: ${validValues}`
        }
      }
    })
  }
}

export function CustomIsDate(validationOptions?: ValidationOptions){
  return function (target: Object, propertyName: string){
    registerDecorator({
      name: "customIsDate",
      target: target.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any){
          return value instanceof Date && !isNaN(value.getTime())
        },
        defaultMessage(){
          return `${propertyName} must be a valid date`
        }
      }
    })
  }
}