
import {Captcha} from '../src/main'
import {CacheManager}from '../src/cache/cacheManager'
import { Driver } from '../src/captcha/captcha';
import { CacheAdapter } from '../src/cache/adapter';
import {CaptchaInterface}from '../src/captcha/captchaInterface'
describe('CacheManager Tests', () => {
    let captcha:Captcha;
    let store:CacheAdapter;
    let driver:Driver
  
    beforeAll(() => {
        store=new CacheManager(false)
        driver=new CaptchaInterface()
        captcha=new Captcha(store,driver)
    });

    test('should return base64 picture',async()=>{
        let result = await captcha.generateStringCaptcha();
        let exist=await captcha.verify(result.id,result.code)
        expect(typeof result.id).toBe('string')
        expect(result.code).not.toBeNull()
        expect(exist).toBe(true)
    })
})