# mtchw Play Store Release Checklist

This checklist is for preparing mtchw for a quiet Google Play Store launch.

Current app status:

- App name: mtchw
- App type: Android-first boredom-button app
- Stack: React + Vite + TypeScript + Capacitor Android
- Backend: None
- Account system: None
- Main data storage: Local device storage only
- Web deployment: https://mtchw.vercel.app/
- Android debug APK: Working
- App icon: Working
- Favicon: Working
- Offline activity database: Working

---

## 1. Current MVP Features

- [x] Home screen
- [x] Device-based light/dark theme
- [x] Blue visual theme
- [x] App icon inside header
- [x] Favicon
- [x] SEO/OG image
- [x] Android app icon
- [x] Energy selection
- [x] Time selection
- [x] Category selection
- [x] Activity card
- [x] Done button
- [x] Skip button
- [x] Save button
- [x] More Like This button
- [x] Saved activities screen
- [x] Remove saved activity
- [x] Clear saved activities
- [x] History screen
- [x] Clear history
- [x] Local storage persistence
- [x] 300+ offline activities
- [x] GitHub repo connected
- [x] Vercel deployment connected
- [x] Debug APK installed on Android phone

---

## 2. Before Release Build

- [ ] Run full QA checklist from `QA_CHECKLIST.md`
- [ ] Test on real Android phone again
- [ ] Test light mode
- [ ] Test dark mode
- [ ] Test app after closing and reopening
- [ ] Test saved activities persistence
- [ ] Test history persistence
- [ ] Test clear saved
- [ ] Test clear history
- [ ] Test activity suggestion variety
- [ ] Test High + Learn
- [ ] Test Low + Calm
- [ ] Test Medium + Useful
- [ ] Test 10 min + Learn
- [ ] Test 15+ min + Random
- [ ] Confirm no broken layout on phone
- [ ] Confirm app icon still appears correctly
- [ ] Confirm Vercel site still works

---

## 3. Store Listing Assets Needed

Required or strongly recommended:

- [x] App icon
- [x] Feature graphic source image
- [x] OG/SEO image
- [ ] Phone screenshots
- [ ] Short app description
- [ ] Full app description
- [ ] Privacy policy page
- [ ] Support/contact email
- [ ] App category
- [ ] Content rating questionnaire
- [ ] Data safety form answers

---

## 4. Suggested Store Listing Text

### App Name

mtchw

### Short Description

A simple boredom button for tiny things to do.

### Full Description

mtchw is a simple app for moments when you are bored, tired of scrolling, tired of games, or tired of watching videos, but still want one small thing to do.

Open the app, tap “I’m bored,” choose your energy, time, and category, then get one tiny activity.

mtchw can suggest small activities that are fun, useful, creative, calm, educational, social, or random.

Examples:

- Delete a few old screenshots
- Learn one new word
- Take a few slow breaths
- Send a simple check-in message
- Write a fake movie title
- Find a forgotten photo
- Tidy one tiny area

mtchw is not a social media app, not a feed, not a serious productivity app, and not a therapy app.

It is just a low-pressure boredom button.

### Key Features

- One small activity at a time
- Energy, time, and category filters
- Saved activities
- Activity history
- Works mostly offline
- No account required
- No social feed
- No complicated setup

---

## 5. Privacy Position

mtchw MVP privacy position:

- No account required
- No login
- No cloud sync
- No backend database
- No personal profile
- Activity history stays on the device
- Saved activities stay on the device
- User preferences stay on the device
- Users can clear saved activities
- Users can clear history

A privacy policy is still needed for Google Play.

Suggested simple privacy policy message:

mtchw does not require an account and does not collect personal information in the MVP. Saved activities, history, and preferences are stored locally on your device. You can clear saved activities and history inside the app.

---

## 6. Google Play Console Requirements

To publish on Google Play, prepare:

- [ ] Google Play Developer account
- [ ] App name
- [ ] Default language
- [ ] App or game selection
- [ ] Free or paid selection
- [ ] Store listing
- [ ] App icon
- [ ] Feature graphic
- [ ] Screenshots
- [ ] Privacy policy URL
- [ ] Data safety form
- [ ] Content rating questionnaire
- [ ] Target audience declaration
- [ ] App access declaration
- [ ] Ads declaration
- [ ] Release app bundle
- [ ] Closed testing, if required
- [ ] Production access request, if required

---

## 7. Testing Track Notes

For new personal developer accounts, Google Play may require closed testing before production release.

Checklist:

- [ ] Create closed testing track
- [ ] Add tester email list
- [ ] Upload signed release AAB
- [ ] Share opt-in link with testers
- [ ] Get at least 12 testers opted in, if required
- [ ] Keep test running for required duration, if required
- [ ] Collect feedback
- [ ] Fix issues
- [ ] Apply for production access

---

## 8. Release Build Checklist

Before creating release build:

- [ ] Increment app version if needed
- [ ] Build web app
- [ ] Sync Capacitor Android
- [ ] Build signed Android App Bundle
- [ ] Save keystore safely
- [ ] Back up keystore
- [ ] Never commit keystore to GitHub
- [ ] Upload AAB to Play Console
- [ ] Test generated install from Play Console if available

---

## 9. Commands We Use Often

Development build:

```bash
cd ~/GitHub/mtchw
npm run build
npx cap sync android
cd android
./gradlew assembleDebug