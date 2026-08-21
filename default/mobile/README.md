# SHOP Mobile

Expo SDK 57 client for the SHOP store.

## Local run

From the repository root:

```powershell
Push-Location mobile
npm install
npm run web
Pop-Location
```

For Android emulator, the default API URL is `http://10.0.2.2:3000`. For a
physical device, create `mobile/.env` from `.env.example` and set
`EXPO_PUBLIC_API_URL` to the computer's LAN address, for example
`http://192.168.1.20:3000`.

The app needs a mobile Bearer token. In development, issue one through
`POST /api/mobile/auth/token` using the demo `userId` flow, or exchange an
authenticated NextAuth web session. The token can be pasted into the app and
is stored in SecureStore on native platforms.

## Android APK

Install and log in to EAS CLI, then run:

```powershell
Push-Location mobile
npx eas build --platform android --profile preview
Pop-Location
```

The `preview` profile produces an installable APK. A production AAB uses the
`production` profile and requires an Android signing setup in EAS.