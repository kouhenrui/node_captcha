import { createCanvas, loadImage } from "canvas";
import crypto from 'crypto';
import Commander from "ioredis/built/utils/Commander";
// export namespace Captcha{
  export interface CaptchaOptions {
    width: number;
    height: number;
    length: number;
    fontSize: number;
    noise: number;
  }
  export const defaultCaptchaOptions: CaptchaOptions = {
    width: 240,
    height: 80,
    length: 4,
    fontSize: 40,
    noise: 6,
  };
  
  
  
  export interface Driver {
    generateStringCaptcha(): Promise<{ code: string; image: string }>;
    generateMathCaptcha(): Promise<{ code: string; answer: string }>;
    generateMathStringCaptcha(): Promise<{ code: string; image: string }>;
    generateSwipeCaptcha(): Promise<{
      background: string;
      slider: string;
      position: { x: number; y: number };
    }>;
  }
  
  export class CaptchaImp implements Driver {
    private options: CaptchaOptions;
    constructor(options?: CaptchaOptions) {
      this.options = options ? options : defaultCaptchaOptions;
    }

    private generateCode(): string {
      const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      return Array.from({ length: this.options.length }, () =>
        chars.charAt(Math.floor(Math.random() * chars.length))
      ).join("");
    }

    //get the math captcha code and answer
    private generateRadonMath(n: number): { code: string; answer: string } {
      // 初始化第一个数字
      let num = crypto.randomInt(1, 10); // 生成范围 [1, 10) 的随机数
      let expression = `${num}`;
      let result = num;

      // 定义可用的运算符
      const operators = ["+", "-", "*", "/"];

      for (let i = 0; i < n; i++) {
        // 随机选择一个运算符
        const operator = operators[crypto.randomInt(0, operators.length)];

        let nextNum = crypto.randomInt(1, 10); // 生成范围 [1, 10) 的随机数

        // 根据操作符更新结果
        switch (operator) {
          case "+":
            result += nextNum;
            break;
          case "-":
            // 确保减法后结果为非负数
            while (result - nextNum < 0) {
              nextNum = crypto.randomInt(1, 10);
            }
            result -= nextNum;
            break;
          case "*":
            result *= nextNum;
            break;
          case "/":
            // 确保除法可以整除
            while (result % nextNum !== 0) {
              nextNum = crypto.randomInt(1, 10);
            }
            result = Math.floor(result / nextNum);
            break;
        }

        // 构建表达式
        expression = `(${expression} ${operator} ${nextNum})`;
      }

      expression += " =";
      return { code: expression, answer: result.toString() };
    }

    /**
     * generateStringCaptcha
     */
    public async generateStringCaptcha(): Promise<{
      code: string;
      image: string;
    }> {
      const { width, height, fontSize, noise } = this.options;

      // 创建画布
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext("2d");

      // 设置背景色
      ctx.fillStyle = "#f0f0f0";
      ctx.fillRect(0, 0, width, height);

      // 生成验证码代码
      const code = this.generateCode();

      // 设置字体
      ctx.font = `${fontSize}px sans-serif`;
      ctx.fillStyle = "#333";

      // 计算文本的宽度和高度
      const textWidth = ctx.measureText(code).width;
      const textHeight = fontSize;

      // 计算居中的位置
      const x = (width - textWidth) / 2; // 居中对齐 X 轴
      const y = (height + textHeight) / 2; // 居中对齐 Y 轴（稍微向下偏移一点）

      // 绘制验证码文本
      ctx.fillText(code, x, y); // Add noise
      for (let i = 0; i < noise; i++) {
        ctx.strokeStyle = `rgba(${Math.random() * 255}, ${
          Math.random() * 255
        }, ${Math.random() * 255}, 0.7)`;
        ctx.beginPath();
        ctx.moveTo(Math.random() * width, Math.random() * height);
        ctx.lineTo(Math.random() * width, Math.random() * height);
        ctx.stroke();
      }

      // Return base64 image
      return {
        code,
        image: canvas.toDataURL(),
      };
    }

    /**
     * generateMathStringCaptcha
     */
    public async generateMathStringCaptcha(): Promise<{
      code: string;
      image: string;
    }> {
      const { width, height, fontSize, noise } = this.options;

      // 创建画布
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext("2d");

      // 设置背景色
      ctx.fillStyle = "#f0f0f0";
      ctx.fillRect(0, 0, width, height);

      // 生成验证码代码
      const { code, answer } = this.generateRadonMath(this.options.length);

      // 设置字体
      ctx.font = `${fontSize}px sans-serif`;
      ctx.fillStyle = "#333";

      // 计算文本的宽度和高度
      const textWidth = ctx.measureText(code).width;
      const textHeight = fontSize;

      // 计算居中的位置
      const x = (width - textWidth) / 2; // 居中对齐 X 轴
      const y = (height + textHeight) / 2; // 居中对齐 Y 轴（稍微向下偏移一点）

      // 绘制验证码文本
      ctx.fillText(code, x, y); // Add noise
      for (let i = 0; i < noise; i++) {
        ctx.strokeStyle = `rgba(${Math.random() * 255}, ${
          Math.random() * 255
        }, ${Math.random() * 255}, 0.7)`;
        ctx.beginPath();
        ctx.moveTo(Math.random() * width, Math.random() * height);
        ctx.lineTo(Math.random() * width, Math.random() * height);
        ctx.stroke();
      }

      // Return base64 image
      return {
        code: answer,
        image: canvas.toDataURL(),
      };
    }

    /**
     * generateMathCaptcha
     */
    public async generateMathCaptcha(): Promise<{
      code: string;
      answer: string;
    }> {
      return this.generateRadonMath(this.options.length);
    }

    /**
     * generateSwipeCaptcha
     */
    public async generateSwipeCaptcha(): Promise<{
      background: string;
      slider: string;
      position: { x: number; y: number };
    }> {
      const canvas = createCanvas(this.options.width, this.options.height);
      const ctx = canvas.getContext("2d");

      // Fill background with a solid color
      ctx.fillStyle = "#f0f0f0";
      ctx.fillRect(0, 0, this.options.width, this.options.height);

      // Draw some random shapes for a basic background
      for (let i = 0; i < 10; i++) {
        ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${
          Math.random() * 255
        }, 0.5)`;
        ctx.beginPath();
        ctx.arc(
          Math.random() * this.options.width,
          Math.random() * this.options.height,
          Math.random() * 50 + 10,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
      // Generate random position for the slider
      const sliderWidth = 50;
      const sliderHeight = 50;
      const sliderX =
        Math.floor(Math.random() * (this.options.width - sliderWidth - 20)) +
        10;
      const sliderY =
        Math.floor(Math.random() * (this.options.height - sliderHeight - 20)) +
        10;

      // Create a shape for the slider
      const sliderCanvas = createCanvas(sliderWidth, sliderHeight);
      const sliderCtx = sliderCanvas.getContext("2d");

      sliderCtx.beginPath();
      sliderCtx.arc(
        sliderWidth / 2,
        sliderHeight / 2,
        sliderWidth / 2,
        0,
        Math.PI * 2
      );
      sliderCtx.clip();

      // Draw the cutout piece
      sliderCtx.fillStyle = "#ccc";
      sliderCtx.fillRect(0, 0, sliderWidth, sliderHeight);

      // Clear the slider region on the main canvas
      ctx.save();
      ctx.beginPath();
      ctx.arc(
        sliderX + sliderWidth / 2,
        sliderY + sliderHeight / 2,
        sliderWidth / 2,
        0,
        Math.PI * 2
      );
      ctx.clip();
      ctx.clearRect(sliderX, sliderY, sliderWidth, sliderHeight);
      ctx.restore();

      return {
        background: canvas.toDataURL(),
        slider: sliderCanvas.toDataURL(),
        position: { x: sliderX, y: sliderY },
      };
    }
  }


