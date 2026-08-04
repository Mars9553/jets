// kore landing page desu
import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useUser } from '@/context/UserContext';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import '../styles/tailwind-output.css';

export default function LandingPage() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/user_notice');
    }
  }, [user, loading]);

  if (loading) {
    return <LoadingScreen message="Loading portal..." />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-800 font-sans">
      <header className="flex items-center py-6 px-6 max-w-6xl w-full mx-auto box-border">
        <div className="flex items-center gap-2 text-lg font-bold text-slate-800 cursor-pointer select-none" onClick={() => router.push('/(auth)/' as any)}>
          <svg className="w-5.5 h-5.5 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
          <span className="whitespace-nowrap tracking-tight">Digital Bulletin Board</span>
        </div>
      </header>

      <main className="flex flex-col items-center text-center px-6 pt-4 md:pt-8 pb-16 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-600 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide mb-6 select-none">
          <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
          </svg>
          Now Live on Campus
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight mb-5">
          Stay Connected with <span className="text-blue-500">Campus Life</span>
        </h1>
        <p className="text-base text-slate-500 leading-relaxed max-w-lg mb-8">
          Access real-time notices, upcoming events, and official memos all in one unified digital board. Works offline, keeps you notified, and built for students.
        </p>
        <div className="flex gap-3 justify-center">
          <button className="px-6 py-2.5 rounded-full bg-blue-500 text-white font-semibold text-sm hover:bg-blue-600 shadow-md shadow-blue-500/10 transition duration-200 cursor-pointer whitespace-nowrap" onClick={() => router.push('/(auth)/register' as any)}>
            Get Started
          </button>
          <button className="px-6 py-2.5 rounded-full border border-slate-200 bg-transparent text-slate-700 font-semibold text-sm hover:bg-slate-50 transition duration-200 cursor-pointer whitespace-nowrap" onClick={() => router.push('/(auth)/' as any)}>
            Sign In
          </button>
        </div>
      </main>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full mx-auto px-6 pb-16 box-border">
        <div className="bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-0.5 transition duration-300">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-slate-50 text-blue-500 mb-4">
            <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Real-time Memos</h3>
          <p className="text-xs leading-relaxed text-slate-500">Receive official notices instantly. Filter by academic, urgent, or social categories.</p>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-0.5 transition duration-300">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-slate-50 text-blue-500 mb-4">
            <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Campus Events</h3>
          <p className="text-xs leading-relaxed text-slate-500">Never miss out. Browse SUG weeks, career fairs, seminars, and lectures with details.</p>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-0.5 transition duration-300">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-slate-50 text-blue-500 mb-4">
            <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Offline Support</h3>
          <p className="text-xs leading-relaxed text-slate-500">Saved notices are fully cached and readable offline, keeping you updated on the go.</p>
        </div>
      </section>

      <footer className="mt-auto border-t border-slate-100 py-6 text-center text-sm text-slate-400 bg-white/50">
        <p>&copy; {new Date().getFullYear()} Digital Bulletin Board. All rights reserved.</p>
      </footer>
    </div>
  );
}
