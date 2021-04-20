import { OS } from '@vkontakte/vkui';

export const getOrigin = window.location.origin;

export const errMap = (error: any) => {
  if (error && error.error_type && error.error_data) {
    return mapVkError(error);
  } else {
    return JSON.stringify(error, ['message', 'statusCode']);
  }
};

export const mapVkError = (error: any) => {
  const type: 'client_error' | 'api_error' | 'auth_error' = error.error_type;
  const data = error.error_data;

  if (type === 'client_error') {
    return `Code: ${data.error_code}, Reason: ${data.error_reason}, Desc: ${data.error_description}`;
  }

  if (type === 'api_error') {
    return `Code: ${data.error_code}, Mssg: ${data.error_msg}`;
  }

  if (type === 'auth_error') {
    return `Code: ${data.error}, Reason: ${data.error_reason}, Desc: ${data.error_description}`;
  }

  return `Unknown vk error ${JSON.stringify(error, ['message', 'statusCode'])}`;
};

function iOS() {
  return (
    ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(
      navigator.platform
    ) ||
    // iPad on iOS 13 detection
    (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
  );
}

export const platform = () => (iOS() ? OS.IOS : OS.ANDROID);

export const sortByCreated = <T extends { created: string }>(f: T, n: T) =>
  new Date(n.created).getTime() - new Date(f.created).getTime();
