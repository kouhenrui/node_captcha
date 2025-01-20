import * as Captcha from './captcha'

export class CaptchaInterface {
  private driver: Captcha.Driver;
  constructor(option?: Captcha.CaptchaOptions) {
    let options = option ? option : Captcha.defaultCaptchaOptions;
    this.driver = new Captcha.CaptchaImp(options);
  }
  async generateStringCaptcha(): Promise<{ code: string; image: string }> {
    return await this.driver.generateStringCaptcha();
  }

  async generateMathCaptcha(): Promise<{ code: string; answer: string }> {
    return await this.driver.generateMathCaptcha();
  }
  async generateMathStringCaptcha(): Promise<{ code: string; image: string }> {
    return await this.driver.generateMathStringCaptcha();
  }
  async generateSwipeCaptcha(): Promise<{
    background: string;
    slider: string;
    position: { x: number; y: number };
  }> {
    return await this.driver.generateSwipeCaptcha();
  }
}