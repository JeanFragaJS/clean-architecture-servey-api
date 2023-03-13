import { AccessDeniedError, badRequest, HttpRequest, HttpResponse, LoadAcccountByToken, Middleware, ok, serverError, Validation } from "./auth-middleware-protocols";

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly validation: Validation,
    private readonly loadAccountByToken: LoadAcccountByToken,
    private readonly role: string
  ){}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.headers?.['x-access-token']) 
      if (error) return badRequest(new AccessDeniedError());
  
      const token = httpRequest.headers?.['x-access-token']
      const account = await this.loadAccountByToken.loadByToken(token, this.role);
      if (!account) return badRequest(new AccessDeniedError());

      return ok({id: account.id}); 
    } catch (error) {
      return serverError(error);
    }
  }
}