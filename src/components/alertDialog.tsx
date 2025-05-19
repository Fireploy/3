import { ReactNode } from "react";

type Variant = "info" | "warning" | "error" | "success";

type Props = {
  title: string;
  text: string;
  cancel?: boolean;
  acceptButton: ReactNode;
  variant?: Variant;
};

const variantStyles = {
  info: {
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    iconPath: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6v6m0 4h.01M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
      />
    ),
  },
  warning: {
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
    iconPath: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v2m0 4h.01M10.29 3.86L1.82 18c-.78 1.34.2 3 1.71 3h16.94c1.51 0 2.49-1.66 1.71-3L13.71 3.86a2 2 0 00-3.42 0z"
      />
    ),
  },
  error: {
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    iconPath: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
      />
    ),
  },
  success: {
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    iconPath: <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />,
  },
};
export default function AlertDialog({
  acceptButton,
  text,
  title,
  cancel,
  variant = "info",
}: Props) {
  const styles = variantStyles[variant];

  return (
    <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true"></div>
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div
                  className={`mx-auto flex size-12 shrink-0 items-center justify-center rounded-full ${styles.iconBg} sm:mx-0 sm:size-10`}
                >
                  <svg
                    className={`size-6 ${styles.iconColor}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                    data-slot="icon"
                  >
                    {styles.iconPath}
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-base font-semibold text-gray-900" id="modal-title">
                    {title}
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">{text}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              {acceptButton}
              {cancel && (
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
