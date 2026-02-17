import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { loginService } from '../../service/login.service';
import { tokenService } from '../../service/auth.service';
import { useNotificationStore } from '../../service/notification.service';
import type { IAuthInputDto } from '../../types/models';

interface LoginFormData {
  email: string;
  password: string;
}

export default function Login() {
  const { t } = useTranslation('translation');
  const navigate = useNavigate();
  const showToast = useNotificationStore((state) => state.showToast);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: 'admin@ibasolutions.com.br',
      password: 'StrongPassword',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const auth: IAuthInputDto = {
        email: data.email,
        password: data.password,
      };

      const response = await loginService.login(auth);
      tokenService.saveToken(response.token);
      showToast(t('pages.login.success'), t('pages.login.loginSuccess'), 'success');
      navigate('/dashboard');
    } catch (error: any) {
      const message = error.response?.data?.message || t('pages.login.loginError');
      showToast(t('pages.login.failure'), message, 'error');
    }
  };

  return (
    <main className="h-screen w-full flex flex-col lg:flex-row">
      {/* Lado Esquerdo - Branding */}
      <div className="hidden lg:flex w-full lg:w-1/2 h-screen bg-gray-100 flex-col relative overflow-hidden">
        {/* Imagem decorativa superior esquerda */}
        <div className="absolute top-0 left-0 z-0">
          <img
            src="/assets/images/svgs/login/image 84.svg"
            alt=""
            className="h-auto"
            style={{ maxWidth: '100%' }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>

        {/* Logo centralizado verticalmente */}
        <div className="flex-1 flex items-center justify-center z-10 relative">
          <img
            src="/assets/images/svgs/login/logoNovo.svg"
            alt="Beanstalk Logo"
            className="h-auto"
            style={{ maxWidth: '300px' }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      </div>

      {/* Lado Direito - Formulário */}
      <div className="w-full lg:w-1/2 h-screen bg-white flex items-center justify-center relative overflow-hidden py-8">
        {/* Elementos decorativos */}
        {/* Esfera superior direita */}
        <div className="absolute top-[10%] right-[5%] z-0">
          <img
            src="/assets/images/svgs/login/image 86.svg"
            alt=""
            className="h-auto"
            style={{ maxWidth: '200px' }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>

        {/* Imagem inferior direita */}
        <div className="absolute bottom-0 right-0 z-0">
          <img
            src="/assets/images/svgs/login/image 85.png"
            alt=""
            className="h-auto"
            style={{ maxHeight: '200px' }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>

        {/* Formulário */}
        <div className="w-full max-w-md px-8 z-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('pages.login.title')}</h1>
            <p className="text-gray-600">{t('pages.login.subtitle')}</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                <strong>{t('pages.login.email')}</strong>
              </label>
              <input
                id="email"
                type="email"
                {...register('email', {
                  required: t('common.validation.emailRequired'),
                  minLength: { value: 6, message: t('common.validation.emailMinLength') },
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                placeholder={t('pages.login.emailPlaceholder')}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                <strong>{t('pages.login.password')}</strong>
              </label>
              <input
                id="password"
                type="password"
                {...register('password', {
                  required: t('common.validation.passwordRequired'),
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                placeholder={t('pages.login.passwordPlaceholder')}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={!isValid}
                className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {t('pages.login.signIn')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
