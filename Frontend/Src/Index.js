@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-gray-50;
}

.chat-bubble {
  @apply rounded-lg p-3 max-w-[80%];
}

.chat-bubble-admin {
  @apply chat-bubble bg-blue-500 text-white self-start;
}

.chat-bubble-user {
  @apply chat-bubble bg-gray-200 text-gray-800 self-end;
}
