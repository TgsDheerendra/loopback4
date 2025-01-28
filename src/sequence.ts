import {AuthenticateFn, AuthenticationBindings} from '@loopback/authentication'; // Import Authentication bindings
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

  constructor(
    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND) public send: Send,
    @inject(SequenceActions.REJECT) public reject: Reject,
    @inject(AuthenticationBindings.AUTH_ACTION)
    private authenticate: AuthenticateFn, // Inject authentication function
  ) {}

  async handle(context: RequestContext): Promise<void> {
    try {
      const {request, response} = context;

      // Invoke middleware
      const finished = await this.invokeMiddleware(context);
      if (finished) return;

      const route = this.findRoute(request);

      // Authenticate the request using your JwtStrategy
      await this.authenticate(request);

      const args = await this.parseParams(request, route);
      const result = await this.invoke(route, args);

      this.send(response, result);
    } catch (error) {
      this.reject(context, error);
    }
  }
}
