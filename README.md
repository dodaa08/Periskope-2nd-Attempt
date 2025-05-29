# 🧠 Real-Time Chat App

A full-stack, real-time chat application built with **Next.js**, **TypeScript**, **Tailwind CSS**, and **Supabase**, inspired by modern chat platforms like **Preiskope**. This app supports live messaging, typing indicators, online presence, and more — all in a minimal yet elegant UI.

---

## How it flows

![image](https://github.com/user-attachments/assets/6169ca5f-48fd-45f2-abff-41ae46239583)

---

## 🚀 Features

- ⚡ Real-time messaging powered by Supabase subscriptions  
- 🧑‍💻 Online presence and user status  
- ✍️ Typing indicators  
- 💬 Group and direct messages  
- 🔒 Auth via Supabase (email/password & magic link)  
- 🌗 Dark/light mode toggle (Tailwind)  
- 🔔 Notification badges for unread messages  
- 📱 Responsive design for all screen sizes  
- 🛠️ Inspired by Preiskope UX for fast and simple comms  

---

## 🛠️ Tech Stack

| Technology   | Purpose                                   |
|--------------|-------------------------------------------|
| Next.js      | React framework + SSR                     |
| TypeScript   | Type safety                               |
| TailwindCSS  | Styling                                   |
| Supabase     | Backend-as-a-Service (auth, DB, real-time)|

---
## 📁 Project Structure

A scalable and maintainable **Next.js** project structure:

- root/
  - public/               <!-- Static assets (images, icons, fonts) -->
  - src/                  <!-- Source code -->
    - app/                <!-- App routing (Next.js 13+) -->
      - (auth)/           <!-- Auth-related routes -->
      - chat/             <!-- Chat-related routes -->
      - layout.tsx        <!-- Root layout -->
      - page.tsx          <!-- Main entry page -->
    - components/         <!-- Reusable UI components -->
      - ui/               <!-- Generic UI (Button, Modal, etc.) -->
      - layout/           <!-- Header, Footer, Sidebar, etc. -->
      - features/         <!-- Domain-specific (Auth, Dashboard) -->
    - hooks/              <!-- Custom React hooks -->
    - lib/                <!-- API clients, constants, helpers -->
    - utils/              <!-- Utility/helper functions -->
    - types/              <!-- TypeScript types/interfaces -->
    - styles/             <!-- Global/component styles -->
  - package.json          <!-- Project metadata -->
  - next.config.js        <!-- Next.js config -->




---

## 🔧 Setup Instructions

1. **Clone the repository**
    ```
    git clone https://github.com/your-username/realtime-chat-app.git
    cd realtime-chat-app
    ```

2. **Install dependencies**
    ```
    npm install
    ```

3. **Create a `.env.local` file and add the following:**
    ```
    NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
    ```

4. **Run the app locally**
    ```
    npm run dev
    ```

---

## 🧪 Testing

Coming soon...

---

## 💡 Inspiration

This project is inspired by Preiskope — bringing the speed, minimalism, and powerful chat experience to a modern open-source stack.

---

## 🙌 Contributions

Contributions are welcome! Feel free to open an issue or submit a pull request. Let's build together!

---

## 📄 License

MIT License

---

Made with ❤️ by Kartik

---

Happy shipping! 🚢

_Current date: Wednesday, May 28, 2025, 11:52 PM IST_
