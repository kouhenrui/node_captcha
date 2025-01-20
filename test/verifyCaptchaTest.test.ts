import { dir } from "console";
import { Driver } from "../src/captcha/captcha";
import { CaptchaInterface } from "../src/captcha/captchaInterface";
const isValidString = (str: any): boolean => {
  return (
    typeof str === "string" &&
    str !== null &&
    str !== undefined &&
    str.length > 3
  );
};
describe('CacheManager Tests', () => {
//   let redisClient:any;
let driver: Driver;

  beforeAll(() => {
    driver = new CaptchaInterface();
    // Initialize Redis client for testing
    // redisClient = new Redis();
  });

  // test("should return isValidString", async () => {
  //   let { code, image } = await driver.generateStringCaptcha();

  //   expect(isValidString(code)).toBe(true);
  //   expect(image.length>50).toBe(true)
  //   // expect(typeof code).to;
  //   // expect(image.length).toHaveLength(10);
  //   // expect(code.length).toHaveLength(3);
  // });

  test('generate math captcha',async()=>{
    let {code,answer}=await driver.generateMathCaptcha();
    // console.log(code,answer)
    expect(isValidString(code)).toBe(true)
  })

  test('generate swipe captcha',async()=>{
    let { background, slider, position } = await driver.generateSwipeCaptcha();

    //Check if background is string and not null
    expect(typeof background).toBe("string");
    expect(background).not.toBeNull();

    //Check if slider is string and not null
    expect(typeof slider).toBe("string");
    expect(slider).not.toBeNull();

    // Check if position is an object
    expect(typeof position).toBe("object");
    expect(position).not.toBeNull();

    // Check if x and y exist
    expect(position).toHaveProperty("x");
    expect(position).toHaveProperty("y");

    // Check if x and y are not null, undefined, or empty strings
    expect(position.x).not.toBeNull();
    expect(position.y).not.toBeNull();
    expect(position.x).not.toBe("");
    expect(position.y).not.toBe("");

    // Optionally check if x and y are numbers
    expect(typeof position.x).toBe("number");
    expect(typeof position.y).toBe("number");

    console.dir(position)
  })

})