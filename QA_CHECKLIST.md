# mtchw QA Checklist

Use this checklist before major commits, before Android packaging, and before any public testing.

---

## 1. Basic App Launch

- [ ] App starts without errors.
- [ ] No blank white screen.
- [ ] Browser console has no serious errors.
- [ ] App title shows as `mtchw`.
- [ ] Header tagline appears correctly.
- [ ] Bottom navigation appears correctly.

---

## 2. Home Screen

- [ ] Home screen loads first.
- [ ] `I’m bored` button is visible.
- [ ] `Surprise me` button is visible.
- [ ] Home screen copy feels clear and simple.
- [ ] Buttons are easy to tap on mobile size.

---

## 3. Preference Flow

Tap `I’m bored`.

- [ ] Preference screen opens.
- [ ] Back button returns to Home.
- [ ] Energy options appear:
  - [ ] Low
  - [ ] Medium
  - [ ] High
  - [ ] Surprise me
- [ ] Time options appear:
  - [ ] 1 min
  - [ ] 5 min
  - [ ] 10 min
  - [ ] 15+ min
  - [ ] Any
- [ ] Category options appear:
  - [ ] Fun
  - [ ] Useful
  - [ ] Creative
  - [ ] Calm
  - [ ] Learn
  - [ ] Social
  - [ ] Random
- [ ] Selected chips visibly change style.
- [ ] `Give me a thing` button works.
- [ ] Activity shown matches selected preferences when possible.

---

## 4. Surprise Me Flow

From Home:

- [ ] Tap `Surprise me`.
- [ ] App skips preference screen.
- [ ] A real activity appears.
- [ ] Activity card has title, instruction, category, energy, and time.
- [ ] Activity is not empty or broken.

---

## 5. Activity Card

On an activity card:

- [ ] Activity title appears.
- [ ] Activity instruction appears.
- [ ] Category chip appears.
- [ ] Energy chip appears.
- [ ] Time chip appears.
- [ ] Done button appears.
- [ ] Skip button appears.
- [ ] Save button appears.
- [ ] More Like This button appears.

---

## 6. Done Button

- [ ] Tap `Done`.
- [ ] Completion message appears.
- [ ] Done button changes to `Done ✓`.
- [ ] Done button becomes disabled.
- [ ] Tapping Done again does not create duplicate Done history.
- [ ] `Back home` button works.
- [ ] `Another thing` button works.

---

## 7. Skip Button

- [ ] Tap `Skip`.
- [ ] A new activity appears.
- [ ] The same activity does not immediately repeat.
- [ ] Skipped activity appears in History.
- [ ] Skipping several times does not break the app.

---

## 8. Save Button

- [ ] Tap `Save`.
- [ ] Button changes to `Saved ✓`.
- [ ] Save button becomes disabled.
- [ ] Tapping Save again does not duplicate the saved activity.
- [ ] Saved activity appears in Saved screen.
- [ ] Saved action appears in History.

---

## 9. More Like This

- [ ] Tap `More Like This`.
- [ ] A different activity appears.
- [ ] The same activity is not returned.
- [ ] Activity is reasonably related when possible.
- [ ] More Like This does not crash if there are few matching activities.

---

## 10. Saved Screen

- [ ] Saved screen opens from bottom nav.
- [ ] Empty state appears when there are no saved activities.
- [ ] Saved activities appear after saving.
- [ ] Saved cards show title, instruction, category, and time.
- [ ] `Try now` opens the saved activity.
- [ ] `Remove` removes the saved activity.
- [ ] Removed activity does not return after refresh.

---

## 11. History Screen

- [ ] History screen opens from bottom nav.
- [ ] Empty state appears when history is empty.
- [ ] Done activities appear in history.
- [ ] Skipped activities appear in history.
- [ ] Saved activities appear in history.
- [ ] Raw `shown` events are hidden from the visible history list.
- [ ] Status pills look clear.
- [ ] Date/time appears for history items.

---

## 12. Settings Screen

- [ ] Settings opens from bottom nav.
- [ ] Local data explanation appears.
- [ ] Privacy explanation appears.
- [ ] About explanation appears.
- [ ] `Clear saved` works.
- [ ] `Clear history` works.
- [ ] `Reset app data` works.
- [ ] Reset returns user to Home.
- [ ] Reset clears saved activities.
- [ ] Reset clears visible history.
- [ ] Reset returns preferences to default.

---

## 13. Local Storage

Test by refreshing the browser.

- [ ] Saved activities persist after refresh.
- [ ] History persists after refresh.
- [ ] Last selected preferences persist after refresh.
- [ ] Cleared saved activities remain cleared after refresh.
- [ ] Cleared history remains cleared after refresh.
- [ ] Reset app data remains reset after refresh.

---

## 14. Preference Matching

Test these combinations:

- [ ] Low + 1 min + Calm
- [ ] Low + 5 min + Fun
- [ ] Medium + 5 min + Useful
- [ ] High + 5 min + Learn
- [ ] High + Any + Random
- [ ] Surprise me + Any + Random
- [ ] 10 min + Learn
- [ ] 15+ min + Random

For each:

- [ ] App returns an activity.
- [ ] App does not crash.
- [ ] If exact match is not available, fallback still returns something reasonable.

---

## 15. Mobile Responsiveness

Use browser mobile preview and real phone later.

- [ ] No horizontal scrolling.
- [ ] Buttons are large enough to tap.
- [ ] Cards fit on small screens.
- [ ] Bottom navigation is readable.
- [ ] Text does not overflow.
- [ ] Chips wrap cleanly.
- [ ] Saved and History lists scroll properly.
- [ ] Settings screen scrolls properly.

---

## 16. Offline Behavior

After the app is loaded:

- [ ] Turn off internet.
- [ ] App still opens in browser if already loaded.
- [ ] Activity suggestions still work.
- [ ] Saved activities still show.
- [ ] History still shows.
- [ ] Settings still works.

Note: Full offline install behavior will be tested later after Android packaging.

---

## 17. Build Check

Run:

```bash
npm run build