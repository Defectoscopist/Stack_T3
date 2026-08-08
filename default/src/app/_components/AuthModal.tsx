"use client";

import { signIn } from "next-auth/react";
import { X } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export function AuthModal({
  isOpen,
  onClose,
  title = "Sign in required",
  message = "Please sign in to continue.",
}: AuthModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          <p className="text-gray-500 mb-6">{message}</p>
          <div className="space-y-3">
            <button
              onClick={() => signIn("github")}
              className="w-full bg-gray-900 text-white rounded-full py-3 font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              Sign in with GitHub
            </button>
            <button
              onClick={() => signIn("google")}
              className="w-full bg-white text-gray-700 rounded-full py-3 font-semibold border border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Sign in with Google
            </button>
            <button
              onClick={() => signIn("vk")}
              className="w-full bg-[#0077FF] text-white rounded-full py-3 font-semibold hover:bg-[#0066DD] transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.684 0H8.316C2.879 0 0 2.879 0 8.316v7.368C0 21.121 2.879 24 8.316 24h7.368C21.121 24 24 21.121 24 15.684V8.316C24 2.879 21.121 0 15.684 0zm3.812 17.285h-1.594c-.482 0-.631-.372-1.463-1.197-.731-.686-1.04-.762-1.226-.762-.283 0-.366.103-.366.613v1.01c0 .393-.12.613-1.133.613-1.66 0-3.5-1.002-4.797-2.873-1.833-2.327-2.35-4.062-2.35-4.433 0-.186.083-.358.613-.358h1.592c.462 0 .634.186.788.634.566 1.58 1.546 3.003 1.943 3.003.151 0 .214-.062.214-.4v-2.539c0-.904-.525-.979-.525-.979s.413-.317.972-.317h1.76c.413 0 .545.214.545.676v2.882c0 .427.186.565.303.565.245 0 .538-.138.827-.427.903-1.028 1.57-2.573 1.57-2.573.084-.165.214-.31.469-.31h1.595c.483 0 .593.234.483.648-.138.69-2.142 3.907-2.142 3.907-.172.262-.241.393 0 .676.165.241.717.703 1.089 1.129.552.634.986 1.175 1.113 1.548.13.393-.069.613-.524.613z"/>
              </svg>
              Sign in with VK
            </button>
            <button
              onClick={() => signIn("yandex")}
              className="w-full bg-[#FC3F1D] text-white rounded-full py-3 font-semibold hover:bg-[#E0381A] transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm1.39 5.114c.786 0 1.348.246 1.687.738.34.492.51 1.23.51 2.214v1.624c0 .984-.17 1.722-.51 2.214-.34.492-.901.738-1.688.738-.786 0-1.355-.246-1.707-.738-.352-.492-.528-1.23-.528-2.214V8.066c0-.984.176-1.722.528-2.214.352-.492.921-.738 1.707-.738zm-3.377 10.102l.682-1.706c.454-.084.869-.19 1.245-.32.84.983 1.706 1.475 2.596 1.475s1.73-.387 2.32-1.16c.589-.754.884-1.82.884-3.197V7.994c0-1.373-.295-2.443-.884-3.209-.59-.766-1.391-1.148-2.404-1.148-1.414 0-2.455.634-3.125 1.902-.444-.564-1.073-.851-1.887-.851-.935 0-1.648.318-2.14.954-.492.635-.738 1.49-.738 2.564v10.516h1.94V8.927c0-.648.112-1.126.336-1.435.224-.31.532-.464.923-.464.447 0 .828.19 1.144.57.316.38.474.909.474 1.586v5.54h1.739l.155.492z"/>
              </svg>
              Sign in with Yandex
            </button>
          </div>
          <p className="mt-6 text-xs text-gray-400">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}