import {AuthenticateFn, AuthenticationBindings} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {
  FindRoute,
  InvokeMethod,
  ParseParams,
  Reject,
  RequestContext,
  RestBindings,
  Send,
  SequenceHandler,
} from '@loopback/rest';

export class MySequence implements SequenceHandler {
  constructor(
    @inject(RestBindings.SequenceActions.FIND_ROUTE)
    private readonly findRoute: FindRoute,
    @inject(RestBindings.SequenceActions.PARSE_PARAMS)
    private readonly parseParams: ParseParams,
    @inject(RestBindings.SequenceActions.INVOKE_METHOD)
    private readonly invoke: InvokeMethod,
    @inject(RestBindings.SequenceActions.SEND) private readonly send: Send,
    @inject(RestBindings.SequenceActions.REJECT)
    private readonly reject: Reject,
    @inject(AuthenticationBindings.AUTH_ACTION)
    private readonly authenticate: AuthenticateFn,
  ) {}

  async handle(context: RequestContext) {
    const {request, response} = context;
    try {
      const route = this.findRoute(request);
      await this.authenticate(request); // Authenticate user
      const args = await this.parseParams(request, route);
      const result = await this.invoke(route, args);
      this.send(response, result);
    } catch (error) {
      this.reject(context, error);
    }
  }
}
