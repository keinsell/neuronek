export interface TinnyHttpInterceptor {
	intercept(req: any, res: any, next: any): any;
}
