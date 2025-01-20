import { Driver } from './captcha/captcha';
import { CacheAdapter } from './cache/adapter';
// export namespace TsCaptcha{
  export  interface TsCaptchaName{
    store:CacheAdapter
    driver:Driver
  }
  // export interface TsCaptchaInterface{
  //   generateStringCaptcha():Promise<string>;//get string captcha
  //   generateMathCaptcha():Promise<string>;//get math captcha
  //   generateMathStringCaptcha():Promise<string>;//get string math captcha
  //   generateSwipeCaptcha():Promise<string>;//get swiper captcha
  //   verify(id:string,answer:string):Promise<boolean>//verify captcha
  // }
// }

//make random string as id to store captcha answer
const MakeRadom=async()=>{
  const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from({ length: 4 }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join("");
}
export class Captcha{
  // private tsCaptcha!: TsCaptchaName;
  private store:CacheAdapter;
  private driver:Driver;
  constructor(store:CacheAdapter,driver:Driver){
    this.driver=driver
    this.store=store
    // this.tsCaptcha.store=store
    // this.tsCaptcha.driver=driver
  }

  //generate string captcha and use store to store the mathCaptcha  answer
  async generateStringCaptcha():Promise<{id:string,code:string,image:string}> {
    const result=await this.driver.generateStringCaptcha()
    const random=await MakeRadom()
    await this.store.set(random,result.code,60)
    const res={
      ...result,
      id:random
    }
    return res
  }

  //generate math captcha and use store to store the mathCaptcha  answer
  async generateMathCaptcha():Promise<string>{
    const result=await this.driver.generateStringCaptcha()
    const random=await MakeRadom()
    await this.store.set(random,result.code,60)
    return result.image
  }



  //generate string math captcha and use store to store the mathCaptcha  answer
  async generateStringMathCaptcha():Promise<string>{
    const result=await this.driver.generateStringCaptcha()
    const random=await MakeRadom()
    await this.store.set(random,result.code,60)
    return result.image
  }
  //generate swipe captcha and use store to store the mathCaptcha  answer
  async generateSwipeCaptcha():Promise<string>{
    const result=await this.driver.generateStringCaptcha()
    const random=await MakeRadom()
    await this.store.set(random,result.code,60)
    return result.image
  }
  //verify captcha answer boolean and use store to verify answer exist
  async verify(id:string,answer:string):Promise<boolean>{
    const result=await this.store.get(id)
    if(result==answer)return true
    return false
  }
}

