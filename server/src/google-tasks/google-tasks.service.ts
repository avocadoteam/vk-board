import { Injectable, HttpService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { buildQueryString } from 'src/utils/api';

const scopes = [
  'email',
  'profile',
  encodeURI('https://www.googleapis.com/auth/userinfo.email'),
  encodeURI('https://www.googleapis.com/auth/userinfo.profile'),
  'openid',
  encodeURI('https://www.googleapis.com/auth/tasks.readonly'),
];

@Injectable()
export class GoogleTasksService {
  constructor(
    private httpService: HttpService,
    private config: ConfigService,
  ) {}

  getHost(hostName: string) {
    return this.config.get<boolean>('core.devMode')
      ? `http://${hostName}:${this.config.get<boolean>('core.port')}`
      : `https://${hostName}`;
  }

  googleAuthFirstStep(hostName: string) {
    const host = this.getHost(hostName);
    const url = `https://accounts.google.com/o/oauth2/v2/auth${buildQueryString(
      [
        { client_id: this.config.get<string>('integration.gClient', '') },
        { redirect_uri: `${host}/google/complete` },
        { response_type: 'code' },
        { scope: scopes.join('+') },
        { prompt: 'select_account' },
        { state: '{}' },
      ],
    )}`;
    return url;
  }

  async processGoogleLogin(code: string, hostName: string) {
    // const onSuccess = () => {
    //   return res.render('finishAuth', { layout: false });
    // };
    // const onFail = (error: Error) => {
    //   return res.status(HTTPStatus.BadRequest).send({ error: error.message });
    // };

    // const code = req.query['code'] || '';
    // if (!code) return onFail(new Error(LocalError.CANNOT_GET_MORE_INFO));
    const host = this.getHost(hostName);

    const accessToken = await this.getAccessToken(code, host);
    console.log('accessToken', accessToken);
    // if (!accessToken) return onFail(new Error(LocalError.CANNOT_GET_MORE_INFO));
    // const userInfo = await getUserInfo(accessToken);

    // if (!userInfo?.email)
    //   return onFail(new Error(LocalError.CANNOT_GET_MORE_INFO));

    // const user = await registerExternalUser(userInfo.email, userInfo.name);

    // return await authUser(
    //   req,
    //   res,
    //   user.email,
    //   user.password,
    //   onSuccess,
    //   onFail,
    // );
  }

  async getAccessToken(code: string, host: string) {
    const result = await this.httpService
      .post(
        `https://www.googleapis.com/oauth2/v4/token${buildQueryString([
          { code: code },
          { client_id: this.config.get<string>('integration.gClient', '') },
          {
            client_secret: this.config.get<string>(
              'integration.gClientSecret',
              '',
            ),
          },
          { redirect_uri: `${host}/google/complete` },
          { grant_type: 'authorization_code' },
        ])}`,
      )
      .toPromise();

    if (result.data.error) {
      console.log(
        '[GoogleTasksService] access_token failed',
        result.data.error?.error_msg,
      );
      return '';
    }

    return result.data.access_token ?? '';
  }
}
