import { registerAs } from '@nestjs/config';

export default registerAs('integration', () => ({
  vkServiceKey: process.env.VK_SERVICE_KEY,
  vkSecretKey: process.env.VK_SECRET_KEY,
  gClientSecret: process.env.G_CLIENT_SECRET,
  gClient: process.env.G_CLIENT,
  sentryDNS: process.env.SENTRY_DNS,
  vkConfirmCode: process.env.VK_CONFIRM_CODE,
  vkCbSecret: process.env.VK_CB_SECRET,
  marusyaSkillId: process.env.MARUSYA,
  avoToken: process.env.AVO_TOKEN
}));
