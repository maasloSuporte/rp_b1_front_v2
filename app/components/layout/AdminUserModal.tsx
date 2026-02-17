import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import i18n from "@/translate";
import { authService } from "@/service/auth.service";

const LANGUAGE_OPTIONS = [
  { value: "en", labelKey: "userDropdown.languageEnglish" as const },
  { value: "pt-BR", labelKey: "userDropdown.languagePortuguese" as const },
] as const;

interface AdminUserModalProps {
  open: boolean;
  onClose: () => void;
  /** Nome do usuário exibido no modal (ex: do token ou contexto) */
  userName?: string;
  /** Email do usuário (ex: do token ou contexto) */
  userEmail?: string;
}

export default function AdminUserModal({
  open,
  onClose,
  userName = "Admin",
  userEmail = "",
}: AdminUserModalProps) {
  const { t } = useTranslation("translation");
  const currentLng = i18n.language || "pt-BR";

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const lng = event.target.value as "en" | "pt-BR";
    i18n.changeLanguage(lng);
  };

  const handleLogout = () => {
    onClose();
    authService.logout();
  };

  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
                {/* Header com título e botão fechar */}
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                  <Dialog.Title as="h2" className="text-lg font-semibold text-gray-900">
                    {userName}
                  </Dialog.Title>
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                    aria-label={t("common.buttons.close")}
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>

                {/* Conteúdo: avatar, email, último login */}
                <div className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-pink-100 text-pink-600 font-semibold text-lg">
                      {userName.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {userName}
                      </p>
                      {userEmail && (
                        <p className="truncate text-sm text-gray-500">{userEmail}</p>
                      )}
                      <p className="mt-0.5 text-xs text-gray-500">
                        {t("userDropdown.lastLogin")}: {t("userDropdown.justNow")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Separador e seleção de idioma */}
                <div className="border-t border-gray-200 px-6 py-4">
                  <label htmlFor="admin-language-select" className="mb-2 block text-sm font-medium text-gray-700">
                    {t("userDropdown.selectLanguage")}
                  </label>
                  <select
                    id="admin-language-select"
                    value={currentLng}
                    onChange={handleLanguageChange}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  >
                    {LANGUAGE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {t(opt.labelKey)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Rodapé: Minhas configurações + Sair */}
                <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4 bg-gray-50">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onClose();
                      // TODO: navegar para /settings quando existir rota
                    }}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    {t("userDropdown.mySettings")}
                  </a>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                  >
                    {t("userDropdown.logOut")}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
