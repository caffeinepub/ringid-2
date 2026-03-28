# RingID 2

## Current State
- App has header with hamburger menu, logo, search, bell, QR, TV icons
- Navigation is via hamburger drawer only (no tab bar)
- BottomNav component exists but renders nothing
- All pages: Home, Video (live rooms), TV, Chat, Apps, Profile, LiveRoom

## Requested Changes (Diff)

### Add
- Top tab bar directly below the header with tabs: Home, Video, TV, Chat, Apps (matching screenshot exactly)
- Each tab has an icon and label, active tab has orange underline
- Quick action shortcuts row: Profile (avatar circle), Add Status (pencil+plus), Wallet, My Code (QR), Events — horizontally scrollable
- COVID-19 banner cards (two side by side): one with UPDATE button, one with তথ্য কেন্দ্র
- JOIN LIVE PUBLIC ROOM card and COMMUNITY DISCOUNT ZONE card side by side
- Live streamers list at bottom with photo, name, LIVE timer

### Modify
- HomePage: Replace current quick actions with screenshot-accurate shortcuts row
- HomePage: Add COVID-19 cards, JOIN LIVE, COMMUNITY DISCOUNT ZONE cards above live streamer section
- App.tsx: Add top tab navigation that switches between Home/Video/TV/Chat/Apps pages
- Remove TV icon from header (TV is now in top tabs)

### Remove
- Bottom tab bar (already removed)
- TV shortcut from header icon row (now in top tab bar)

## Implementation Plan
1. Update App.tsx to include TopNav tab bar below header area, passing active tab and navigate to all pages
2. Create TopNav component with Home, Video, TV, Chat, Apps tabs with icons and orange active indicator
3. Update HomePage to match screenshot layout: quick shortcuts row (Profile, Add Status, Wallet, My Code, Events), COVID-19 cards, JOIN LIVE + COMMUNITY DISCOUNT cards, then live streamers
4. Pass navigate function to allow tab switching from header
