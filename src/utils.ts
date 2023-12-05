export class Exception extends Error {
    code : number; // it is defined into Error

    constructor(code: number, message: string){
        super(message);
        this.message = message;
        this.code = code;
    }
}

export function tokenExist(token: string | undefined | null): void {
    if(token === undefined || token === null) 
        throw new Exception(400, 'Missing token');
}