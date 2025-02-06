import {AuthenticateFn, AuthenticationBindings} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {
  FindRoute,
  InvokeMethod,
  InvokeMiddleware,
  ParseParams,
  Reject,
  RequestContext,
  Send,
  SequenceActions,
  SequenceHandler,
} from '@loopback/rest';

export class MySequence implements SequenceHandler {
  @inject(SequenceActions.INVOKE_MIDDLEWARE, {optional: true})
  protected invokeMiddleware: InvokeMiddleware = () => false;
  // Not from cli, Added manually
  constructor(
    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND) public send: Send,
    @inject(SequenceActions.REJECT) public reject: Reject,
    @inject(AuthenticationBindings.AUTH_ACTION)
    private readonly authenticate: AuthenticateFn,
  ) {}

  async handle(context: RequestContext): Promise<void> {
    try {
      const {request, response} = context;
      const finished = await this.invokeMiddleware(context);
      if (finished) return;

      const route = this.findRoute(request);

      await this.authenticate(request); // Enforce Authentication
      const args = await this.parseParams(request, route);
      const result = await this.invoke(route, args);

      this.send(response, result);
    } catch (error) {
      this.reject(context, error);
    }
  }
}
