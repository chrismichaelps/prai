# Changelog

## 2026-03-30

We added haptic feedback for mobile interactions, so tapping buttons like Send, the microphone, suggestions, and sidebar items now feels more responsive and satisfying. We also standardized all code comments into clean JSDoc format and moved a lot of scattered magic values and constants into a central file to make the codebase cleaner and more maintainable.

## 2026-03-28

This was a big day for stability and user experience. We fixed duplicate API calls in development, added proper rate limiting, and created a Health Status page where you can check the status of our main services. We also made meaningful accessibility improvements, strengthened security with better XSS protection, and smoothed out session handling for real-time features.

On the features side, we introduced usage tracking with Free and Pro tiers, including daily and monthly limits with nice progress bars. Even better, we launched the full **Personalization** system. You can now customize how the AI communicates with you — choosing styles like Professional, Friendly, Quirky, or Cynical, and adjusting warmth, enthusiasm, emoji usage, and more. There’s now a dedicated Personalization page to make the AI feel truly yours.

## 2026-03-27

Focused on improving the AI’s accuracy, especially for Puerto Rico tourism topics. We also fixed a few small usability issues that sometimes appeared while messages were streaming.

## 2026-03-26

Fixed a frustrating bug that caused message loss when archiving or restoring chats. We also added better internal monitoring and tracing to keep things running smoothly.

## 2026-03-25

We launched the complete Issue Tracker, a full notification system with unread badges, user search functionality, and some admin tools. Reporting bugs and suggesting features is now much easier and better organized.

## 2026-03-24

Added a proper Release Notes section (this page!) and fixed several issues with Google sign-in to make logging in more reliable across different flows.

## 2026-03-23

A major behind-the-scenes cleanup. We improved validation, error handling, and overall architecture across the app. Many API behaviors are now cleaner and more consistent, and we added several important security and reliability improvements.

## 2026-03-22

Significantly improved error messages with friendlier toast notifications. We added a dynamic sitemap and robots.txt for better SEO, fixed multiple security vulnerabilities, and removed a lot of old unused code and dependencies.

## 2026-03-21

Two features I’m really excited about landed today. You can now edit previous messages in a chat and have the AI continue from the edited version (time-travel style). We also added a working Stop button during streaming responses.

We also introduced the Sources Sidebar, which shows references and links in real time as the AI answers — making it easier to verify information.

## 2026-03-20

Gave the app a fresh new look with a deep black background and warm amber accents. Improved mobile navigation, scrolling, and overall smoothness. We also restructured our internal prompts for higher quality, safer, and more consistent answers.

## 2026-03-19

**Official Launch!**

Released **PR/AI** — the world’s first AI-powered Puerto Rico tourism assistant. A smart, bilingual (English & Spanish), media-rich experience built to help people explore and enjoy the island.