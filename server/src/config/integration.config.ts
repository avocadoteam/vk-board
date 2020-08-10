import { registerAs } from '@nestjs/config';

export default registerAs('integration', () => ({
  vkServiceKey: process.env.VK_SERVICE_KEY,
  vkSecretKey: process.env.VK_SECRET_KEY
}));
