export interface CacheAdapter {
    set(key: string, value: string, ttl: number): Promise<void>;
    get(key: string): Promise<string | null>;
    delete(key: string): Promise<void>;
    exist(key:string):Promise<boolean>
  }
  
  export interface RedisOption{
    host:string
    port:number
    db?:number
    password?:string
    username?:string
  }